#!/usr/bin/env node

var path = require('path'),
    ionicMinify = require('ionic-minify'),
    config = require('../minify-conf.json'),
    cmd = process.env.CORDOVA_CMDLINE,
    rootDir = process.argv[2],
    platforms = process.env.CORDOVA_PLATFORMS.split(','),
    platformPath = path.join(rootDir, 'platforms'),
    minify = false;

if (cmd.indexOf('--release') > -1) {
  console.log('WARN: The use of the --release flag is deprecated!! Use --minify instead!');
  minify = true;
} else {
  minify = config.alwaysRun || (cmd.indexOf('--minify') > -1);
}

config.showErrStack = (config.showErrStack || false);
config.jsOptions.fromString = true;
if (minify) {
  var ionicMinify = new ionicMinify.Minifier(config, platforms, platformPath);
  console.log('Starting to minify your files...');
  ionicMinify.run();
}
