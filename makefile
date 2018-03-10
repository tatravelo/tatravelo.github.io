.PHONY: install update build serve npm css

install:
	bundle install

update:
	bundle update

build: npm js
	bundle exec jekyll build

serve:
	bundle exec jekyll serve --config _config.yml,_config.dev.yml --host localhost --future

npm:
	npm install
js: npm
	npm run build:js
