angular.module('recruitX')
  .controller('loginController', ['$ionicPopup', '$rootScope', '$scope', '$state', '$ionicHistory', 'loggedinUserStore', 'oktaUrl', 'cordova', function ($ionicPopup, $rootScope, $scope, $state, $ionicHistory, loggedinUserStore, oktaUrl, cordova) {
    'use strict';

    var isUserSignedIn = function () {
      return loggedinUserStore.userId();
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
