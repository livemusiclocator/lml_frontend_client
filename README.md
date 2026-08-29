# Live Music Locator Gigs Frontend Client

This is the gig explorer: the react/vite single page app behind
`https://gigs.lml.live` and the explorer embedded in the
`livemusiclocator.com.au` pages.

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

| Served by | `APP_CONFIG` from | API it talks to |
| --- | --- | --- |
| the vite dev server | the `index.html` in this repo | `api.lml.live` (production) |
| rails in development | `explorer_config.json.jbuilder` | `api.lml.test` (your rails) |
| rails in production | same | `api.lml.live` |

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
caddy from the shared repo. You are reading live production data.

There are also per-edition targets in `package.json` (`npm run dev-melbourne` and
friends) which set `VITE_LML_LOCATION` and a base path.

Be aware the standalone `index.html` is a stand-in for the page rails renders, so
its config and surrounding layout are not what real users get.

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
firebase login           # once
make install             # `make build` does not install for you
make deploy
```

`make deploy` runs `make clean`, `make build` and then
`firebase deploy --only hosting`. The clean is not optional - the bundle
directories are the build targets, so without it make would leave a stale one
in place and the deploy would ship it.

The firebase CLI is not an npm dependency of this repo; install it however you
like (`brew install firebase-cli`, or `npm i -g firebase-tools`) as long as
`firebase` is on your PATH.

`make build` produces **three** bundles under `dists/firebase_root/`, and the
deploy publishes all of them at once:

| Directory | Consumed by | Built with |
| --- | --- | --- |
| `lml_gig_explorer_live` | rails production, `www.livemusiclocator.com.au` | production mode |
| `lml_gig_explorer_beta` | rails test, `beta.livemusiclocator.com.au` | production mode |
| `lml_gig_explorer_dev` | every developer's local rails | `--mode development` |

They are identical builds bar the mode; they exist as separate paths because
`firebase.json` gives each one a different `Access-Control-Allow-Origin`
(the tags rails emits use `crossorigin="anonymous"`, so the header is required).

Two things to keep in mind:

- **The `_dev` bundle is shared.** Deploying replaces what every other developer's
  local rails loads by default.
- **Promoting to production is a deploy from this repo**, not a rails release.
  There is no separate promotion step - `live` is built from your working tree.

`rollupOptions` in `vite.config.js` pins the entrypoint names to
`lml_gig_explorer.js` / `.css` so the URLs stay stable across deploys.

### The old github pages deploy

`./deploy` is dead and exits immediately (it points at `deploy_firebase`, which
is gone too - use `make deploy`). It used to push builds into a set of
`*.github.io` repos, one per city, before everything moved to firebase. Likewise
`caddyfile` and `caddy_up.sh` in this repo predate the shared caddy config in the
`lml` repo and cover the `lml-development.live` domains rather than `.lml.test`.

## CI

None yet.
