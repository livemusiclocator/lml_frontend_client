usage:
	@echo "make install"
	@echo "       Install node dependencies"
	@echo "make run"
	@echo "       Just Run the development server"
	@echo "make dev"
	@echo "       Install and Run the development server"
	@echo "make caddy"
	@echo "       Run the Caddy server"
	@echo "make open"
	@echo "       Open the site in the browser"

install:
	npm install

dev:
	$(MAKE) install
	$(MAKE) dev

run:
	npm run dev

caddy:
	./caddy_up.sh

open:
	open https://gigs.lml-development.live
