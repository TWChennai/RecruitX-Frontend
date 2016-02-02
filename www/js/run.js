angular.module('recruitX')
  .run(function ($cordovaSplashscreen, $rootScope, $ionicPlatform, recruitFactory) {
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

      /* Get roles and Skills */
      var request = 0;
      recruitFactory.getSkills(function (skills) {
        $rootScope.skills = skills;
        request++;
        hideSplashScreen();
      });

      recruitFactory.getRoles(function (roles) {
        $rootScope.roles = roles;
        request++;
        hideSplashScreen();
      });

      recruitFactory.getInterviewTypes(function (interview_types) {
        $rootScope.interview_types = interview_types;
        request++;
        hideSplashScreen();
      });

      function hideSplashScreen() {
        if (request >= 3) {
          // $cordovaSplashscreen.hide();     // TODO: Fix later
          console.log('TODO: Need to fix hiding of splash screen.');
        }
      }
    });
  });
