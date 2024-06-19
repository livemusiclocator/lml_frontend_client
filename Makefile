usage:
	@echo "make install"
	@echo "       Install dependencies"
	@echo "make run"
	@echo "       Run the development server"
	@echo "make ci"
	@echo "       Run the tests"
	@echo "make caddy"
	@echo "       Run the Caddy server"
	@echo "make open"
	@echo "       Open the site in the browser"

install:
	npm install

run: install
	npm run dev

ci: install
	npm test

caddy:
	./caddy_up.sh

open:
	open https://gigs.lml-development.live
