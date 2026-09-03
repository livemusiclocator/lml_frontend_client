usage:
	@echo "make install"
	@echo "       Install dependencies"
	@echo "make run"
	@echo "       Run the development server"
	@echo "make ci"
	@echo "       Run the tests"
	@echo "make build"
	@echo "       Build for deployment"
	@echo "make deploy"
	@echo "       Build and publish every bundle to firebase hosting"
	@echo "make watch"
	@echo "       Rebuild the dev bundle on change, for a local rails to consume"

install:
	npm install

run: install
	npm run dev

ci: install
	npm test

# build vars
FIREBASE_ROOT = dists/firebase_root
BETA_DIR = $(FIREBASE_ROOT)/lml_gig_explorer_beta
LIVE_DIR = $(FIREBASE_ROOT)/lml_gig_explorer_live
DEV_DIR = $(FIREBASE_ROOT)/lml_gig_explorer_dev
BUILD_CMD = npm run build -- --base="./" --manifest=manifest.json --outDir
BUILD_DEV_CMD = npm run build -- --base="./" --mode development --manifest=manifest.json --outDir


.PHONY: build clean watch deploy

build: $(BETA_DIR) $(LIVE_DIR) ${DEV_DIR}

# rebuild the dev bundle on every change, for serving to a local rails via
# assets.lml.test (see the caddy target in the lml repo)
watch:
	$(BUILD_DEV_CMD) $(DEV_DIR) --watch

# we could just build this once but it does not take long and maybe we want to use in future to manage releases?
$(BETA_DIR):
	@mkdir -p $@
	$(BUILD_CMD) $@

$(LIVE_DIR):
	@mkdir -p $@
	$(BUILD_CMD) $@

$(DEV_DIR):
	@mkdir -p $@
	$(BUILD_DEV_CMD) $@

# publishes all three bundles at once, production included - see README. the
# bundle directories are the build targets, so a stale one would never rebuild
# and we would quietly ship yesterday's code: clean first, always.
deploy:
	$(MAKE) clean
	$(MAKE) build
	firebase deploy --only hosting

clean:
	rm -rf dists
