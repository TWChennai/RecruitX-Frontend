// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'recruitX' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('recruitX', ['ngFileUpload', 'ionic', 'ui.router', 'ngCordova', 'ngResource'])
  // TODO: Move this into a properties/json file that is read in when the app starts
  .constant('endpoints', {
    apiUrl: '10.134.125.194:4001'
  })

  .config(function ($stateProvider, $urlRouterProvider, $compileProvider, $ionicConfigProvider) {
    'use strict';

    $ionicConfigProvider.backButton.previousTitleText(false);
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

      .state('tabs', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        controller: 'TabsCtrl'
      })

      .state('tabs.interviews', {
        url: "/interviews",
        views: {
          'interviews-tab': {
            templateUrl: 'templates/interviews.html',
            controller: 'TabsCtrl'
          }
        }
      })

      .state('tabs.my-interviews', {
        url: "/my_interviews",
        views: {
          'my-interviews-tab': {
            templateUrl: 'templates/my-interviews.html',
            controller: 'TabsCtrl'
          }
        }
      })

      .state('tabs.candidates', {
        url: "/candidates",
        views: {
          'candidates-tab': {
            templateUrl: 'templates/candidates.html',
            controller: 'TabsCtrl'
          }
        }
      })

      .state('interview-details', {
        url: '/interview-details/:id',
        templateUrl: 'templates/interview-details.html',
        controller: 'interviewDetailsController',
        cache: false
      })

      .state('candidate-tabs', {
        url: '/candidate-tabs',
        abstract: true,
        templateUrl: 'templates/candidate-tabs.html',
        controller: 'candidateTabController',
        cache: false
      })

      .state('candidate-tabs.candidate-profile', {
        url: '/candidates/:candidate_id',
        views: {
          'candidate-profile-tab': {
            templateUrl: 'templates/candidate-profile.html',
            controller: 'candidateProfileController',
            cache: false
          }
        }
      })

      .state('candidate-tabs.candidate-interviews', {
        url: '/candidates/:candidate_id/interviews',
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

    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file):/);

    if (window.localStorage['LOGGEDIN_USER']) {
      $urlRouterProvider.otherwise('/tab/interviews');
    } else {
      $urlRouterProvider.otherwise('/login');
    }
  });
