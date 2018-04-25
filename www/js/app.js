// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'recruitX' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('recruitX', ['ngFileUpload', 'ionic', 'ionic.native', 'ionic.service.analytics', 'ui.router', 'ngCordova', 'ngResource'])
  .config(function ($stateProvider, $urlRouterProvider, $compileProvider, $ionicConfigProvider) {
    'use strict';

    $ionicConfigProvider.backButton.previousTitleText(false);
    $ionicConfigProvider.backButton.text(false);
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file):/);

    $stateProvider
      .state('create-candidate-profile', {
        url: '/candidates/new',
        templateUrl: 'templates/create-candidate-profile.html',
        controller: 'createCandidateProfileController'
      })

      .state('create-slots', {
        url: '/slots/new',
        templateUrl: 'templates/create-slots.html',
        controller: 'createSlotsController'
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
        templateUrl: 'templates/tabs.html',
        controller: 'TabsCtrl'
      })

      .state('tabs.interviews', {
        url: '/interviews',
        templateUrl: 'templates/interviews.html',
        controller: 'TabsCtrl',
        params: {
          tab: 'interviews'
        }
      })

      .state('tabs.my-interviews', {
        url: '/my_interviews',
        templateUrl: 'templates/my-interviews.html',
        controller: 'TabsCtrl',
        params: {
          tab: 'myInterviews'
        }
      })

      .state('tabs.candidates', {
        url: '/candidates',
        templateUrl: 'templates/candidates.html',
        controller: 'TabsCtrl',
        params: {
          tab: 'candidates'
        }
      })

      .state('candidate-tabs', {
        url: '/candidate-tab',
        templateUrl: 'templates/candidate-tabs.html',
        controller: 'CandidateTabsCtrl'
      })

      .state('candidate-tabs.profile', {
        url: '/candidates/:candidate_id',
        templateUrl: 'templates/candidate-profile.html',
        controller: 'CandidateTabsCtrl',
        params: {
          role_id: null,
          tab: 'profile'
        }
      })

      .state('candidate-tabs.interviews', {
        url: '/candidates/:candidate_id/interviews',
        templateUrl: 'templates/candidate-interviews.html',
        controller: 'CandidateTabsCtrl',
        params: {
          role_id: null,
          tab: 'interviews'
        }
      })

      .state('interview-details', {
        url: '/interviews/:interview_id',
        templateUrl: 'templates/interview-details.html',
        controller: 'interviewDetailsController'
      })

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginController'
      })

      .state('about', {
        url: '/about',
        templateUrl: 'templates/about.html',
        controller: 'aboutController'
      });
  });
