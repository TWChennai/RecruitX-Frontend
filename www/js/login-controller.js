angular.module('recruitX')
  .controller('loginController', ['$rootScope', '$scope', '$state', '$ionicHistory', 'oktaSigninWidget', 'loggedinUserStore', 'recruitFactory', function ($rootScope, $scope, $state, $ionicHistory, oktaSigninWidget, loggedinUserStore, recruitFactory) {
    'use strict';

    oktaSigninWidget.renderEl({
      el: '#okta-login-container'
    },
    function (res) {
      if (res.status === 'SUCCESS') {
        recruitFactory.isRecruiter(res.user.profile.login.split('@')[0], function (response) {
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
    });
  }]);
