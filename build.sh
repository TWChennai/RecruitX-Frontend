#!/usr/bin/env sh

npm install

karma start tests/unit-tests.conf.js

# echo "TODO: Need to fix errors reported by eslint and then remove this dummy echo line!!!"

eslint --fix .
