usage:
	@echo "make dev"
	@echo "       Run the development server"
	@echo "make caddy"
	@echo "       Run the Caddy server"
	@echo "make open"
	@echo "       Open the site in the browser"

dev:
	npm install
	npm run dev

caddy:
	./caddy_up.sh

open:
	open https://gigs.lml-development.live
