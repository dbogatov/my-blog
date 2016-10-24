#!/bin/bash

set -e

printf "\n\n\n\n-------\n\n"

echo $(date --rfc-3339=seconds)

SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"

cd $DIR

git fetch origin
git reset --hard origin/master

npm install
bower install

bundle exec /usr/local/bin/jekyll clean
bundle exec /usr/local/bin/jekyll build

curl --request POST 'https://push.dbogatov.org/api/push/deploy' --data "project=My-Blog"
