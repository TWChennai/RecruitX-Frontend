// Karma configuration
// Generated on Mon Jan 04 2016 17:31:56 GMT+0530 (IST)

module.exports = function (config) {
  'use strict';

  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      '../www/lib/ionic/js/ionic.bundle.min.js',
      '../www/lib/ngCordova/dist/ng-cordova.min.js',
      '../www/lib/ionic/js/angular-ui/angular-ui-router.min.js',
      '../www/lib/ionic/js/angular/angular-resource.min.js',
      '../www/lib/ng-file-upload/ng-file-upload-shim.min.js',
      '../www/lib/ng-file-upload/ng-file-upload.min.js',
      '../www/lib/ionic-platform-web-client/dist/ionic.io.bundle.min.js',
      '../www/lib/ionic-native/ionic.native.min.js',
      '../www/js/app.js',
      '../app/app_constants.js',
      '../www/js/helper-services.js',
      '../www/js/api-services.js',
      '../www/js/tabs-controller.js',
      '../www/js/create-candidate-profile-controller.js',
      '../www/js/candidate-tabs-controller.js',
      '../www/js/schedule-interview-controller.js',
      '../www/js/interview-details-controller.js',
      '../www/js/login-controller.js',
      '../www/lib/angular-mocks/angular-mocks.js',
      'unit-tests/**/*.js'
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      '../www/js/**/*.js': ['coverage']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots', 'progress', 'coverage'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    // optionally, configure the reporter
    coverageReporter: {
      dir: '../coverage/',
      reporters: [

        // reporters not supporting the `file` property
        {
          type: 'html',
          subdir: '.'
        }

        // { type: 'lcov', subdir: 'report-lcov' },

        // reporters supporting the `file` property, use `subdir` to directly
        // output them in the `dir` directory
        // { type: 'cobertura', subdir: '.', file: 'cobertura.txt' },
        // { type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt' },
        // { type: 'teamcity', subdir: '.', file: 'teamcity.txt' },
        // { type: 'text', subdir: '.', file: 'text.txt' },
        // { type: 'text-summary', subdir: '.', file: 'text-summary.txt' },
      ]
    }
  });
};
