angular.module('recruitX')
  .controller('loginController', ['$ionicPopup', '$rootScope', '$scope', '$state', '$ionicHistory', 'oktaSigninWidget', 'loggedinUserStore', 'recruitFactory', 'oktaUrl', function ($ionicPopup, $rootScope, $scope, $state, $ionicHistory, oktaSigninWidget, loggedinUserStore, recruitFactory, oktaUrl) {
    'use strict';

    $scope.data = {};
    
    if (window.localStorage['LOGGEDIN_USER']) {
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });
      $ionicHistory.clearCache().then(function () {
        $rootScope.$broadcast('load:masterData');
        $state.go('tabs.interviews');
      });
    }

    $scope.login = function(){
      if (!window.localStorage['LOGGEDIN_USER']) {
        cordova.InAppBrowser.open(oktaUrl, '_system');
      }
      else{
        $ionicHistory.nextViewOptions({
          disableBack: true,
          historyRoot: true
        });
        $ionicHistory.clearCache().then(function () {
          $rootScope.$broadcast('load:masterData');
          $state.go('tabs.interviews');
        });
      }
    }
  }]);
