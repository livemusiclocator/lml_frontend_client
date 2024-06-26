# Live Music Locator Gigs Frontend Client
This is the repo that contains the front end code for the
```
https://gigs.lml.live
```
web site. (and its subdomain variants)

This is client uses https://api.lml.live/ to fetch its data.

## Development
Ensure you have a version of Node running. Look in the `.tool-versions` file.
[asdf](https://asdf-vm.com/) is a good choice as a 'all in one' version manager. But you can pick your poison here.

This project has a `Makefile` which should be the entrypoint for dev work.

To see what it can do run `make usage`.

Get up and running locally:
```bash
make dev # will run install and run
```
### A11y Testing

We have added `https://github.com/NickColley/jest-axe` to use for A11y testing.
This isn't a guarantee but will probably help with the super obvious stuff we will likely miss.

It should run with the `make ci` command.

## CI
TODO

## Deployment

You need to have cloned the https://github.com/livemusiclocator/livemusiclocator.github.io project

```
./deploy
```
