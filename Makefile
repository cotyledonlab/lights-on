SHELL := /bin/zsh
MISE := mise exec --

ifneq (,$(wildcard .env))
include .env
export
endif

.PHONY: bootstrap doctor local-up local-down dev format format-check lint typecheck
.PHONY: test test-e2e build docker-build infra-plan infra-apply
.PHONY: deploy-development deploy-production backup-check

bootstrap:
	mise install
	./scripts/bootstrap-local.sh
	$(MISE) pnpm install --frozen-lockfile=false
	$(MISE) pnpm db:generate

doctor:
	$(MISE) ./scripts/doctor.sh

local-up:
	docker compose up -d postgres
	./scripts/wait-for-postgres.sh
	$(MISE) pnpm db:deploy

local-down:
	docker compose down

dev:
	$(MISE) pnpm dev

format:
	$(MISE) pnpm format

format-check:
	$(MISE) pnpm format:check

lint:
	$(MISE) pnpm lint

typecheck:
	$(MISE) pnpm typecheck

test:
	$(MISE) pnpm test
	$(MISE) pnpm test:integration

test-e2e: local-up
	$(MISE) pnpm test:e2e

build:
	$(MISE) pnpm build

docker-build:
	docker build -f docker/web.Dockerfile -t lights-on-web:local .
	docker build -f docker/worker.Dockerfile -t lights-on-worker:local .

infra-plan:
	./scripts/phase-not-available.sh infra-plan "$(ENV)"

infra-apply:
	./scripts/phase-not-available.sh infra-apply "$(ENV)"

deploy-development:
	./scripts/phase-not-available.sh deploy-development development

deploy-production:
	./scripts/phase-not-available.sh deploy-production production

backup-check:
	./scripts/phase-not-available.sh backup-check "$(ENV)"

