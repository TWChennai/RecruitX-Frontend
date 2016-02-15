angular.module('recruitX')
  .run(function ($ionicPlatform, recruitFactory, MasterData) {
    'use strict';

    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }

      if (window.StatusBar) {
        window.StatusBar.styleDefault();
      }

      var request = 0;
      var maxRequests = 4;

      function hideSplashScreen() {
        if (request >= maxRequests) {
          navigator.splashscreen.hide();
        }
      }

      recruitFactory.getInterviewTypes(function (interviewTypes) {
        MasterData.setInterviewTypes(interviewTypes);
        request++;
        hideSplashScreen();
      });

      recruitFactory.getRoles(function (roles) {
        MasterData.setRoles(roles);
        request++;
        hideSplashScreen();
      });

      recruitFactory.getSkills(function (skills) {
        MasterData.setSkills(skills);
        request++;
        hideSplashScreen();
      });

      recruitFactory.getInterviewStatus(function (interviewStatus) {
        MasterData.setInterviewStatus(interviewStatus);
        request++;
        hideSplashScreen();
      });
    });
  });
