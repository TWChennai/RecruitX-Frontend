#!/usr/bin/env node

var isRelease = /--release/.test(process.env.CORDOVA_CMDLINE),
  path = require('path'),
  glob = require('glob'),
  console = require('console'),

  runShell = function (command) {
    'use strict';

    var exec = require('child_process').exec;

    function puts(error, stdout, stderr) {
      console.log(stdout);
    }

    exec(command, puts);
  },

  rootDir = process.argv[2],
  platformsPath = path.join(rootDir, 'platforms');

glob(path.join(platformsPath, '**', 'index.html'), function (er, files) {
  'use strict';

  var outputFile = path.join(path.dirname(files[0]), 'ip_address.txt');
  if (isRelease === true) {
    // TODO: Public domain name or IP address for production needs to be inserted here
    runShell('echo \'http://128.199.136.71\' > ' + outputFile);
  } else {
    // TODO: This shell command is specific to Mac OSX - might not work on other OSes
    runShell('ifconfig | grep -v \'127.0.0.1\' | egrep -o \'inet ([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})\' | tail -n 1 | awk -F \'[ ]\' \'{print "http://"$2":4000"}\' > ' + outputFile + ' && [ -s ' + outputFile + ' ] || echo \'http://10.0.2.2:4000\' > ' + outputFile);
  }
});
