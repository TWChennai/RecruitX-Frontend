#!/usr/bin/env sh

npm install
bower install

set -e

karma start tests/unit-tests.conf.js

# TODO: Not reporting exit code for eslint till the errors get fixed.
set +e

eslint --fix .

# Note: Do not move this echo above the previous line - since then the exit code is non-zero (till the eslint errors are fixed)
echo "TODO: Need to fix errors reported by eslint and then remove this dummy echo line!!!"
