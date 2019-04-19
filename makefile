.PHONY: help
# https://stackoverflow.com/questions/45692255/how-make-openvpn-work-with-docker fix na vpn

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
USER_ID = `id -u $$USER`
args = `arg="$(filter-out $@,$(MAKECMDGOALS))" && echo $${arg:-${1}}`

dev: ## run next.js dev
	docker-compose run  -u "$(USER_ID)" --name "expenses_dev" --rm --service-ports node yarn dev

build: ## prepare production build
	docker-compose run  -u "$(USER_ID)" -e NODE_ENV=production --rm  node yarn build

start: ## run production build
	docker-compose run  -u "$(USER_ID)" --name "expenses_prod" --rm --service-ports node yarn start

test: ## run production build
	docker-compose run  -u "$(USER_ID)" node yarn test

test--watch: ## run production build
	docker-compose run  -u "$(USER_ID)" node yarn test:watch

install: ## install dependencies
	docker-compose run  -u "$(USER_ID)"  --rm node yarn 

add: ## add new node module
	docker-compose run  -u "$(USER_ID)" --rm node yarn add ${args}

seed: ## seed database
	docker-compose run  -u "$(USER_ID)"  --rm node yarn seed 

up: ## start containers
	docker-compose up -d

down: ## remove containers
	docker-compose down --remove-orphans
