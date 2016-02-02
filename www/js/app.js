// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('starter', ['ionic', 'ui.router', 'ngCordova', 'ngResource'])
// TODO: Move this into a properties/json file that is read in when the app starts
.constant('apiUrl', '192.168.1.106:4000')

.config(function ($stateProvider, $urlRouterProvider) {
  'use strict';

  $stateProvider
    .state('candidate-index', {
      url: '/candidates',
      templateUrl: 'templates/candidate-index.html',
      controller: 'createCandidateProfileController'
    })

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

  .state('candidate-details', {
    url: '/candidate-details',
    templateUrl: 'templates/candidate-details.html',
    controller: ''
  })

  .state('candidate-profile', {
    url: '/candidate-profile/:candidate_id',
    templateUrl: 'templates/candidate-profile.html',
    controller: 'candidateProfileController'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/panelist-signup');
});
