usage:
	@echo "make install"
	@echo "       Install dependencies"
	@echo "make run"
	@echo "       Run the development server"
	@echo "make ci"
	@echo "       Run the tests"
	@echo "make build"
	@echo "       Build for deployment"

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

.PHONY: build clean

build: $(BETA_DIR) $(LIVE_DIR) ${DEV_DIR}

# we could just build this once but it does not take long and maybe we want to use in future to manage releases?
$(BETA_DIR):
	@mkdir -p $@
	$(BUILD_CMD) $@

$(LIVE_DIR):
	@mkdir -p $@
	$(BUILD_CMD) $@

$(DEV_DIR):
	@mkdir -p $@
	$(BUILD_CMD) $@

clean:
	rm -rf dists
