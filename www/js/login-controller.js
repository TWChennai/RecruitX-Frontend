angular.module('recruitX')
  .controller('loginController', ['$ionicPopup', '$rootScope', '$scope', '$state', '$ionicHistory', 'loggedinUserStore', 'oktaUrl', function ($ionicPopup, $rootScope, $scope, $state, $ionicHistory, loggedinUserStore, oktaUrl) {
    'use strict';

    var isUserSignedIn = function () {
      return !!window.localStorage["LOGGEDIN_USER"];
    };

    var launchHomePage = function () {
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });
      $ionicHistory.clearCache().then(function () {
        $rootScope.$broadcast('load:masterData');
        $state.go('tabs.interviews');
      });
    };

    if (isUserSignedIn()) {
      launchHomePage();
    }

    $scope.login = function() {
      if (!isUserSignedIn()) {
        cordova.InAppBrowser.open(oktaUrl, '_system');
      } else {
        launchHomePage();
      }
    }
  }]);
