install: install-deps

install-deps:
	npm ci

test:
	npm test

watch:
	npm run watch

test-coverage:
	npm test -- --coverage --coverageProvider=v8

lint:
	npx eslint --ext=js,jsx .

start:
	npx @hexlet/react-todo-app-with-backend

.PHONY: test
