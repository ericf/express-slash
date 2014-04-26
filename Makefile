test:
	@./node_modules/istanbul/lib/cli.js cover ./node_modules/mocha/bin/_mocha test -- --reporter spec

setup:
	@npm install

clean:
	@rm -rf coverage

.PHONY: test setup clean
