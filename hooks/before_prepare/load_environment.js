#!/usr/bin/env node

var gulp = require('gulp');
var replace = require('gulp-replace-task');

// Get the environment from the command line
var oktaUrl = process.env.OKTA_URL;
var apiKey = process.env.API_KEY;
var apiUrl = process.env.API_URL;
var deployChannel = process.env.DEPLOY_CHANNEL;
var version = process.env.VERSION;
var oktaEnabled = process.env.OKTA_ENABLED;
process.stdout.write('loading env');

// Replace each placeholder with the correct value for the variable.
gulp.src('app/app_constants.js')
  .pipe(replace({
    patterns: [
      {
        match: 'oktaUrl',
        replacement: oktaUrl
      }, {
        match: 'apiKey',
        replacement: apiKey
      }, {
        match: 'apiUrl',
        replacement: apiUrl
      }, {
        match: 'deployChannel',
        replacement: deployChannel
      }, {
        match: 'version',
        replacement: version
      }, {
        match: 'oktaEnabled',
        replacement: oktaEnabled
      }
    ]
  }))
  .pipe(gulp.dest('www/js'));
