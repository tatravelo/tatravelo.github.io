.PHONY: install update build serve npm css

install:
	bundle install

update:
	bundle update

build:
	bundle exec jekyll build

serve:
	bundle exec jekyll serve --config _config.yml,_config.dev.yml --host localhost --future

npm:
	npm install
css: npm
	npm run build:css
js: npm
	npm run build:js
