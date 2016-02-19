#!/usr/bin/env node

var gulp = require('gulp');
var replace = require('gulp-replace-task');
var args = require('yargs').argv;
var fs = require('fs');

// Get the environment from the command line
var env = args.env || process.env.IONIC_ENV || 'dev';
process.stdout.write('loading env');

// Read the settings from the right file
var filename = env + '.json';
var settings = JSON.parse(fs.readFileSync('./config/' + filename, 'utf8'));

// Replace each placeholder with the correct value for the variable.
gulp.src('app/app_constants.js')
  .pipe(replace({
    patterns: [
      {
        match: 'oktaUrl',
        replacement: settings.oktaUrl
      }
    ]
  }))
  .pipe(gulp.dest('www/js'));
