# Live Music Locator Gigs Frontend Client

This is the gig explorer: the react/vite single page app embedded in the
`https://www.livemusiclocator.com.au` pages.

It is built here, deployed to firebase hosting, and served from
`assets.livemusiclocator.com.au`. The rails app in
[lml_rb](https://github.com/livemusiclocator/lml_rb) then pulls it into a page with
a script tag - it is not part of any rails asset pipeline. For how the components
fit together, see the
[shared lml README](https://github.com/livemusiclocator/lml/blob/main/README.md).

## Configuration comes from the hosting page

`src/config.js` holds the defaults, and `window.APP_CONFIG` from the page is merged
over the top. That is how the API endpoint, the available locations, the root path
and the map pin themes arrive, which means **the same bundle behaves differently
depending on who serves it**:

| Served by            | `APP_CONFIG` from               | API it talks to             |
| -------------------- | ------------------------------- | --------------------------- |
| the vite dev server  | the `index.html` in this repo   | `api.lml.live` (production) |
| rails in development | `explorer_config.json.jbuilder` | `api.lml.test` (your rails) |
| rails in production  | same                            | `api.lml.live`              |

## Development

Node is managed with [mise](https://mise.jdx.dev/) - see `.tool-versions`. The
`Makefile` is the entrypoint for dev work; `make usage` lists the targets.

### Standalone, against the production API

The fastest loop, and the right one for most front end work. Vite serves its own
`index.html` (titled "Standalone dev edition"), with hot reload:

```bash
make run        # runs install, then vite on :5173
```

Browse to `http://localhost:5173/`, or `https://gigs.lml.test/` if you are running
caddy from the shared repo. You are reading live production data - nothing needs
configuring for that, `gigsEndpoint` in `src/config.js` defaults to
`https://api.lml.live/gigs` and the standalone `index.html` does not override it.

It opens on the `anywhere` location, which is a wide regional view at zoom 9, so
use the location picker to get to a city. That picker only appears because this
`index.html` sets `allowSelectLocation` - the default in `src/config.js` is off.

Be aware the standalone `index.html` is a stand-in for the page rails renders, so
its config and surrounding layout are not what real users get.

The per-edition targets in `package.json` (`npm run dev-melbourne` and friends)
route correctly, but do **not** preselect a location: `VITE_LML_LOCATION`, which
all eight of them set, is read nowhere in the codebase. Until that is wired up
they are just `make run` with a base path, so use the location picker either way.

Routing used to 404 there as well. `index.html` now derives `rootPath` from
vite's `%BASE_URL%` resolved against the document url, which keeps react-router's
basename in step with wherever the page is actually served from - `/` for
`make run`, `/melbourne` for the per edition targets, and the containing
directory for a built copy. Keep it that way if you touch that config: hardcoding
`rootPath` breaks the per edition targets and every standalone deploy at once,
and `VITE_LML_ROOT_PATH` cannot rescue it because `createAppConfig` merges
`window.APP_CONFIG` _over_ `src/config.js`, so the page always wins.

### The map is pinned to maplibre-gl 5.x

Do not bump it to 6.x. The map renders either way, so this passes a casual look,
but **every vector layer silently stops drawing** - you get the low zoom natural
earth raster and nothing else, no console error and no failed request.

6.x moved tile parsing into a separate worker module whose url it derives at
runtime from `import.meta.url`. Being runtime string manipulation rather than a
static `new URL(...)`, no bundler can see the dependency, so the worker file is
never emitted and the fetch 404s. Vector tiles are parsed in that worker; raster
tiles are decoded on the main thread, which is why the terrain survives and
everything else vanishes. 5.x inlines the worker as a blob and needs nothing from
the bundler.

`@vis.gl/react-maplibre` is held at 8.1.1 to match - 8.1.2 is the release that
moved to maplibre 6.x. If you do want 6.x, it needs `setWorkerUrl()` wired to a
worker vite has been told to emit, plus `worker.format: "es"`, and it must be
verified in a **built** bundle, not just `make run`.

### Against a local rails

No hot reload here - rails loads a built bundle over http, so there is nothing for
vite to push updates into. Build continuously instead:

```bash
make watch      # rebuilds dists/firebase_root/lml_gig_explorer_dev on every change
```

Caddy (from the shared `lml` repo) serves that directory at
`https://assets.lml.test`, mirroring the paths and the CORS header firebase uses.
Then start rails with `SPA_BASE_URL=https://assets.lml.test/lml_gig_explorer_dev` -
the `lml_rb` README covers that end. Reload the page to pick up a rebuild.

### Tests

```bash
make ci
```

Includes [jest-axe](https://github.com/NickColley/jest-axe) for a11y checks. Not a
guarantee, but it catches the obvious things.

## Deployment

Manual, and not gated by CI. You need write access to the `lml-seo` firebase
project (pinned in `.firebaserc`) and to be logged in:

```bash
npx firebase login       # once
make install             # `make build` does not install for you
./deploy_firebase
```

`deploy_firebase` runs `make clean build` and then `firebase deploy --only hosting`.

`make build` produces **three** bundles under `dists/firebase_root/`, and the
deploy publishes all of them at once:

| Directory               | Consumed by                                     | Built with           |
| ----------------------- | ----------------------------------------------- | -------------------- |
| `lml_gig_explorer_live` | rails production, `www.livemusiclocator.com.au` | production mode      |
| `lml_gig_explorer_beta` | rails test, `beta.livemusiclocator.com.au`      | production mode      |
| `lml_gig_explorer_dev`  | every developer's local rails                   | `--mode development` |

They are identical builds bar the mode; they exist as separate paths because
`firebase.json` gives each one a different `Access-Control-Allow-Origin`
(the tags rails emits use `crossorigin="anonymous"`, so the header is required).

This repo has no notion of environments. It always publishes all three, and
**rails** decides which one a page loads, via `SPA_BASE_URL`.

Three things to keep in mind:

- **The `_dev` bundle is shared.** Deploying replaces what every other developer's
  local rails loads by default.
- **Promoting to production is a deploy from this repo**, not a rails release.
  There is no separate promotion step - `live` is built from your working tree.
- **`_beta` is currently consumed by nothing.** `beta.livemusiclocator.com.au`
  points its `SPA_BASE_URL` at `_live`, whose `Access-Control-Allow-Origin` names
  `www` only, so the browser blocks the module script and the explorer never
  boots there. Pointing beta's `SPA_BASE_URL` at `_beta` fixes it - that path
  already carries the right header. It is a change in `lml_rb`, not here.

### Trying a build on a throwaway url

Each built directory contains its own `index.html` - the same standalone page
vite serves in development, with relative asset urls - so it is a complete
working explorer needing no rails and involving no CORS. Combined with a firebase
preview channel that gives you somewhere to try a risky change:

```bash
make build
npx firebase hosting:channel:deploy some-experiment --expires 7d
```

Then open `/lml_gig_explorer_beta/` on the channel url it prints - the trailing
slash matters, as react-router matches the address bar against `rootPath` and a
url ending in `index.html` leaves it with a route it has no match for. There is a
`replaceState` in `index.html` that normalises that away, but the directory form
is the one to share. Production is untouched and the channel expires by itself.

`rollupOptions` in `vite.config.js` pins the entrypoint names to
`lml_gig_explorer.js` / `.css` so the URLs stay stable across deploys.

### The old github pages deploy

`./deploy` is dead and exits immediately. It used to push builds into a set of
`*.github.io` repos, one per city, before everything moved to firebase. Likewise
`caddyfile` and `caddy_up.sh` in this repo predate the shared caddy config in the
`lml` repo and cover the `lml-development.live` domains rather than `.lml.test`.

## CI

None yet.
