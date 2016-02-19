#!/usr/bin/env node

var path = require("path");
var ionic_minify_1 = require("ionic-minify");
var minify;
var config = require("../minify-conf.json");
var cmd = process.env.CORDOVA_CMDLINE;
var rootDir = process.argv[2];
var platforms = process.env.CORDOVA_PLATFORMS.split(',');
var platformPath = path.join(rootDir, "platforms");
if (cmd.indexOf("--release") > -1) {
  console.log("WARN: The use of the --release flag is deprecated!! Use --minify instead!");
  minify = true;
} else {
  minify = config.alwaysRun || (cmd.indexOf("--minify") > -1);
}
config.showErrStack = (config.showErrStack || false);
config.jsOptions.fromString = true;
if (minify) {
  var ionicMinify = new ionic_minify_1.Minifier(config, platforms, platformPath);
  console.log("Starting minifying your files...");
  ionicMinify.run();
}
