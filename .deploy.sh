#!/bin/bash

set -e

SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"

cd $DIR

git fetch origin > /dev/null 2>> deploy.log
git reset --hard origin/master > /dev/null 2>> deploy.log

npm install > /dev/null 2>> deploy.log
bower install --allow-root > /dev/null 2>> deploy.log

# gulp deploy > /dev/null 2>> deploy.log

jykyll clean > /dev/null 2>> deploy.log
jekyll build > /dev/null 2>> deploy.log

curl --request POST 'https://push.dbogatov.org/api/push/deploy' --data "project=My-Blog"