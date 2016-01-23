RecruitX-Frontend
=================

For the default ionic readme, please see [here](/DEFAULT_IONIC_README.md)

## Starting off with this project

After cloning the git repo, please install the following:

```bash
$ npm install -g ionic
```

## To install all the test pre-requisites:

```bash
$ npm install -g karma phantomjs karma-phantomjs-launcher karma-cli bower jasmine karma-jasmine karma-chrome-launcher --save-dev
$ bower install angular-mocks#1.3.13 --save-dev
```
Note:
  1. Always make sure you install the version of `angular-mocks` that is the same version as the `angular` library included in Ionic.
  2. Use the `-g` switch since we need this in the PATH env variable
  3. If you want to use another browser, you'll have to install a launcher for it, so that Karma can call it. Chrome and PhantomJS launchers are included with the default installation.

## Contributing to this codebase:

1. Please ensure that you adhere to the coding guidelines from the previous, exisintg code.
2. Please ensure that you run the following command as a pre-commit check:
  ```bash
  $ ./build.sh
  ```
3. Please ensure that the git commit comments also follow the same pattern as previous comments - so that Mingle can parse the comments.

## Continuous integration:
Our CI server can be found [here](http://10.134.125.194:8153/go/pipelines) - please request one of the existing team members to create access for you.

## Mingle:
Our mingle project wall can be found [here](https://recruitx.mingle.thoughtworks.com/projects/recruit_x/overview) - please request one of the existing team members to create access for you.
