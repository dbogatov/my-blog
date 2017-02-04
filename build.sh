#!/bin/bash
set -e

echo "Installing node modules... Requires NPM"
npm install --loglevel=error > /dev/null

echo "Installing Bower components... Requires Bower (installed by NPM)"
$(npm bin)/bower install --allow-root > /dev/null 2>/dev/null

echo "Removing node modules..."
rm -rf node_modules > /dev/null

echo "Installing gems... Requires Bundle"
bundle install

echo "Cleaning output directory... Requires Jekyll"
bundle exec jekyll clean

echo "Building the website... Requires Jekyll"
bundle exec jekyll build

echo "Build completed!"
