#!/usr/bin/env node

var gulp = require('gulp');
var replace = require('gulp-replace-task');

// Get the environment from the command line
var oktaUrl = process.env.OKTA_URL;
process.stdout.write('loading env');

// Replace each placeholder with the correct value for the variable.
gulp.src('app/app_constants.js')
  .pipe(replace({
    patterns: [
      {
        match: 'oktaUrl',
        replacement: oktaUrl
      }
    ]
  }))
  .pipe(gulp.dest('www/js'));
