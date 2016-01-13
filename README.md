Ionic App Base
=====================

A starting project for Ionic that optionally supports using custom SCSS.

## Using this project

We recommend using the [Ionic CLI](https://github.com/driftyco/ionic-cli) to create new Ionic projects that are based on this project but use a ready-made starter template.

For example, to start a new Ionic project with the default tabs interface, make sure the `ionic` utility is installed:

```bash
$ npm install -g ionic
```

Then run:

```bash
$ ionic start myProject tabs
```

## To install test environment:

```bash
$ npm install jasmine-core --save-dev
$ npm install karma --save-dev
$ npm install karma-jasmine --save-dev
$ bower install angular-mocks#1.3.13 --save-dev
```
Note: Always make sure you install the version of angular-mocks that is the same version as the Angular library included in Ionic.

We'll also need to install the Karma CLI to run Karma from the command line.

```bash
$ npm install -g karma-cli
```

Lastly, we need to decide on a browser to run our unit tests. Karma supports most browsers, but the most popular choice is PhantomJS. It's a headless (no GUI) browser built on WebKit and is perfect for running automated unit tests.

```bash
$ npm install -g phantomjs
```
Note: if you want to use another browser, you'll have to install a launcher for it, so that Karma can call it. Chrome and PhantomJS launchers are included with the default installation.

## To run tests:

```bash
$ karma start unit-tests.conf.js
```

More info on this can be found on the Ionic [Getting Started](http://ionicframework.com/getting-started) page and the [Ionic CLI](https://github.com/driftyco/ionic-cli) repo.

## Issues
Issues have been disabled on this repo, if you do find an issue or have a question consider posting it on the [Ionic Forum](http://forum.ionicframework.com/).  Or else if there is truly an error, follow our guidelines for [submitting an issue](http://ionicframework.com/submit-issue/) to the main Ionic repository.
