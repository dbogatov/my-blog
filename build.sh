#!/bin/bash
set -e

echo "Installing node modules... Requires NPM"
npm install --loglevel=error > /dev/null

echo "Installing Bower components... Requires Bower (installed by NPM)"
$(npm bin)/bower install --allow-root > /dev/null

echo "Removing node modules..."
rm -rf node_modules > /dev/null

echo "Cleaning output directory... Requires Jekyll"
jekyll clean

echo "Building the website... Requires Jekyll"
jekyll build

echo "Build completed!"
