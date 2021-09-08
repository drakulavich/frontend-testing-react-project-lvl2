install: install-deps

install-deps:
	npm ci

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

lint:
	npx eslint .

start:
	npx @hexlet/react-todo-app-with-backend

.PHONY: test
