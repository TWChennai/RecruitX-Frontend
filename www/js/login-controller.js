angular.module('recruitX')
  .controller('loginController', ['$ionicPopup', '$rootScope', '$scope', '$state', '$ionicHistory', 'oktaSigninWidget', 'loggedinUserStore', 'recruitFactory', 'oktaUrl', function ($ionicPopup, $rootScope, $scope, $state, $ionicHistory, oktaSigninWidget, loggedinUserStore, recruitFactory, oktaUrl) {
    'use strict';

    $scope.data = {};
    
    if (!window.localStorage['LOGGEDIN_USER']) {
      cordova.InAppBrowser.open(oktaUrl, '_system');
    }
  }]);
