angular.module('recruitX')
  .controller('loginController', ['$ionicPopup', '$rootScope', '$scope', '$state', '$ionicHistory', 'oktaSigninWidget', 'loggedinUserStore', 'recruitFactory', 'oktaEnabled', function ($ionicPopup, $rootScope, $scope, $state, $ionicHistory, oktaSigninWidget, loggedinUserStore, recruitFactory, oktaEnabled) {
    'use strict';

    $scope.data = {};

    var mockUser = {
      "user": {
        "id": "00u1f0p4lwy4igdAh0h8",
        "passwordChanged": "2018-03-06T09:25:46.000Z",
        "profile": {
          "login": "aravindp@thoughtworks.com",
          "firstName": "Manoharan",
          "lastName": "C",
          "locale": "en",
          "timeZone": "America/Los_Angeles"
        }
      },
      "session": {
        "token": "20111rI8AZu1nXQZ8L25VRAM23eISLXN5l9QeuE1upFFvbqUOGbGBCx"
      },
      "status": "SUCCESS"
    };

    var loginCallBack = function (res) {
      if (res.status === 'SUCCESS') {
        var loginName = res.user.profile.login.split('@')[0];
        if (loginName === 'ppanelist' || loginName === 'ppanelistp') {
          var myPopup = $ionicPopup.show({
            template: '<input ng-model="data.experience">',
            title: 'Enter experience',
            scope: $scope,
            buttons: [
              {
                text: '<b>Done</b>',
                onTap: function () {
                  return $scope.data.experience;
                }
              }
            ]
          });

          myPopup.then(function (experience_input) {
            recruitFactory.isRecruiter(experience_input + loginName, function (response) {
              loggedinUserStore.storeUser(res.user, response);
              $ionicHistory.nextViewOptions({
                disableBack: true,
                historyRoot: true
              });
              $ionicHistory.clearCache().then(function () {
                $state.go('tabs.interviews');
                $rootScope.$broadcast('load:masterData');
              });
            });
          });
        } else {
          recruitFactory.isRecruiter(loginName, function (response) {
            loggedinUserStore.storeUser(res.user, response);
            $ionicHistory.nextViewOptions({
              disableBack: true,
              historyRoot: true
            });
            $ionicHistory.clearCache().then(function () {
              $state.go('tabs.interviews');
              $rootScope.$broadcast('load:masterData');
            });
          });
        }
      }
    };

    if (oktaEnabled === 'false') {
      loginCallBack(mockUser);
      return;
    }

    oktaSigninWidget.renderEl({
        el: '#okta-login-container'
      },
      loginCallBack);
  }]);
