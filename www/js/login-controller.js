angular.module('recruitX')
  .controller('loginController', ['$ionicPopup', '$rootScope', '$scope', '$state', '$ionicHistory', 'oktaSigninWidget', 'loggedinUserStore', 'recruitFactory', function ($ionicPopup, $rootScope, $scope, $state, $ionicHistory, oktaSigninWidget, loggedinUserStore, recruitFactory) {
    'use strict';

    $scope.data = {};

    oktaSigninWidget.renderEl({
      el: '#okta-login-container'
    },
    function (res) {
      if (res.status === 'SUCCESS') {
        var loginName = res.user.profile.login.split('@')[0];
        if(loginName === "ppanelist" || loginName === "ppanelistp"){
          var myPopup = $ionicPopup.show({
            template: '<input ng-model="data.experience">',
            title: 'Enter experience',
            scope: $scope,
            buttons: [
              {

                text: '<b>Done</b>',
                onTap: function(e) {
                  return $scope.data.experience;
                }
              }
            ]
          });

          myPopup.then(function(experience_input) {
            recruitFactory.isRecruiter(experience_input + loginName, function (response) {
              loggedinUserStore.storeUser(res.user, response);
              $ionicHistory.nextViewOptions({
                disableBack: true,
                historyRoot: true
              });
              $ionicHistory.clearCache().then(function(){
                $state.go('tabs.interviews');
                $rootScope.$broadcast('load:masterData');
              });
            });
          });
         }
        else {
          recruitFactory.isRecruiter(loginName, function (response) {
            loggedinUserStore.storeUser(res.user, response);
            $ionicHistory.nextViewOptions({
              disableBack: true,
              historyRoot: true
            });
            $ionicHistory.clearCache().then(function(){
              $state.go('tabs.interviews');
              $rootScope.$broadcast('load:masterData');
            });
          });
        }
      }
    });
  }]);
