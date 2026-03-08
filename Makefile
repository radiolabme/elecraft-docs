# Starlight GitHub Pages Template
# Docker Compose file location
COMPOSE_FILE := .docker/docker-compose.yml

.PHONY: help dev serve ci build clean docker-dev docker-serve docker-ci docker-build docker-clean docker-logs docker-stop docker-shell docker-update docker-audit docker-prune

# Default target
.DEFAULT_GOAL := help

help: ## Show this help
	@echo "Usage: make [target]"
	@echo ""
	@echo "Host targets (require Node.js + npm):"
	@grep -E '^[a-z-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep -v "docker-" | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'
	@echo ""
	@echo "Docker targets (require Docker):"
	@grep -E '^docker-[a-z-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

# =============================================================================
# Host targets (require npm)
# =============================================================================

dev: ## Start development server on host
	@if [ ! -d "node_modules" ]; then npm install; fi
	npm run dev

serve: ## Preview production build on host
	@if [ ! -d "node_modules" ]; then npm install; fi
	npm run preview

ci: ## Run CI checks on host (audit, lint, type-check, build)
	@if [ ! -d "node_modules" ]; then npm ci; fi
	npm run ci

build: ## Build production site on host
	@if [ ! -d "node_modules" ]; then npm ci; fi
	npm run build

clean: ## Clean build artifacts on host
	rm -rf dist node_modules .astro

# =============================================================================
# Docker targets
# =============================================================================

docker-dev: ## Start development server in Docker (auto-finds free port)
	@PORT=$$(sh .docker/find-free-port.sh 4321); \
	echo "Starting dev server on port $$PORT..."; \
	echo "Visit: http://localhost:$$PORT"; \
	PORT=$$PORT docker compose -f $(COMPOSE_FILE) up dev

docker-serve: ## Start production preview in Docker (auto-finds free port)
	@PORT=$$(sh .docker/find-free-port.sh 4321); \
	echo "Starting preview server on port $$PORT..."; \
	echo "Visit: http://localhost:$$PORT"; \
	PORT=$$PORT docker compose -f $(COMPOSE_FILE) up serve

docker-ci: ## Run CI checks in Docker
	@docker compose -f $(COMPOSE_FILE) run --rm ci

docker-build: ## Build production site in Docker
	@docker compose -f $(COMPOSE_FILE) run --rm --entrypoint "" ci sh -c "npm ci && npm run build"

docker-clean: ## Clean up Docker containers and volumes for this project
	@docker compose -f $(COMPOSE_FILE) down -v --remove-orphans
	@rm -rf dist .astro

docker-prune: ## Remove all Docker resources for this project (images, volumes, cache)
	@docker compose -f $(COMPOSE_FILE) down -v --remove-orphans --rmi local
	@rm -rf dist .astro node_modules

docker-logs: ## Show logs from Docker dev server
	@docker compose -f $(COMPOSE_FILE) logs -f dev

docker-stop: ## Stop all Docker services
	@docker compose -f $(COMPOSE_FILE) down

docker-shell: ## Open a shell in the Docker container
	@docker compose -f $(COMPOSE_FILE) run --rm -it --entrypoint "" ci sh

docker-update: ## Update dependencies in Docker (regenerates package-lock.json)
	@docker compose -f $(COMPOSE_FILE) run --rm --entrypoint "" ci sh -c "npm update && npm audit"

docker-audit: ## Run security audit in Docker
	@docker compose -f $(COMPOSE_FILE) run --rm --entrypoint "" ci npm audit
