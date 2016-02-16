// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'recruitX' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('recruitX', ['ngFileUpload', 'ionic', 'ui.router', 'ngCordova', 'ngResource'])
  // TODO: Move this into a properties/json file that is read in when the app starts
  .constant('endpoints', {
    apiUrl: '10.134.125.194:4001',
    oktaUrl: 'https://thoughtworks.okta.com'
  })
  .config(function ($stateProvider, $urlRouterProvider, $compileProvider, $ionicConfigProvider) {
    'use strict';

    $ionicConfigProvider.backButton.previousTitleText(false);
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file):/);

    $stateProvider
      .state('create-candidate-profile', {
        url: '/candidates/new',
        templateUrl: 'templates/create-candidate-profile.html',
        controller: 'createCandidateProfileController'
      })

    .state('schedule-interview', {
      url: '/candidates/interviews/new',
      templateUrl: 'templates/schedule-interview.html',
      controller: 'scheduleInterviewController',
      params: {
        candidate: null
      }
    })

    .state('panelist-signup', {
      url: '/panelist-signup',
      templateUrl: 'templates/panelist-signup.html',
      controller: 'panelistSignupController'
    })

    .state('interview-details', {
      url: '/interview-details/:id',
      templateUrl: 'templates/interview-details.html',
      controller: 'interviewDetailsController'
    })

    .state('candidate-tab-view', {
      url: '/candidate-tabs',
      abstract: true,
      templateUrl: 'templates/candidate-tabs.html',
      controller: 'candidateTabController',
      cache: false
    })

    .state('candidate-profile', {
      url: '/candidates/:id',
      parent: 'candidate-tab-view',
      views: {
        'candidate-profile-tab': {
          templateUrl: 'templates/candidate-profile.html',
          controller: 'candidateProfileController',
          cache: false
        }
      }
    })

    .state('candidate-interviews', {
      url: '/candidates/:id/interviews',
      parent: 'candidate-tab-view',
      views: {
        'candidate-interviews-tab': {
          templateUrl: 'templates/candidate-interviews.html',
          controller: 'candidateInterviewsController',
          cache: false
        }
      }
    })

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginController'
    });

    if (window.localStorage['LOGGEDIN_USER']) {
      $urlRouterProvider.otherwise('/panelist-signup');
    } else {
      $urlRouterProvider.otherwise('/panelist-signup');
    }
  });
