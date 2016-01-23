#!/usr/bin/env sh

npm install

karma start tests/unit-tests.conf.js

jshint .
