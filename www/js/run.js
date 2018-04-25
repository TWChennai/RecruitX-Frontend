angular.module('recruitX')
  .config(function ($httpProvider) {
    'use strict';

    $httpProvider.interceptors.push(function ($rootScope, $q, apiKey) {
      var pendingRequests = 0;
      return {
        request: function (config) {
          if (config.headers['Authorization'] === undefined) {
            config.timeout = 20000;
            config.headers = {
              'Authorization': window.localStorage.API_TOKEN,
              'Content-Type': 'application/json'
            };
          } else {
            config.timeout = 60000;
          }
          if (pendingRequests === 0) {
            $rootScope.$broadcast('loading:show');
          }
          pendingRequests++;
          return config;
        },
        response: function (response) {
          pendingRequests--;
          if (pendingRequests === 0) {
            $rootScope.$broadcast('loading:hide');
          }
          return response;
        },
        responseError: function (response) {
          pendingRequests--;
          if (pendingRequests === 0) {
            $rootScope.$broadcast('loading:hide');
          }
          return $q.reject(response);
        }
      };
    });
  })

  .run(function ($ionicPlatform, $ionicLoading, $rootScope) {
    'use strict';

    $rootScope.$on('loading:show', function () {
      $ionicLoading.show({
        template: '<ion-spinner icon="lines" class="spinner spinner-calm"></ion-spinner>'
      });
    });

    $rootScope.$on('loading:hide', function () {
      $ionicLoading.hide();
    });
  })

  .run(function ($ionicPlatform, $rootScope, $timeout, $state, $cordovaToast, $ionicAnalytics, $cordovaDeeplinks, $ionicHistory, recruitFactory, MasterData, loggedinUserStore) {
    'use strict';

    if(!window.localStorage.LOGGING_IN_PROGRESS)
      window.localStorage.LOGGING_IN_PROGRESS = false;
    
    $ionicPlatform.ready(function () {
    
      $ionicAnalytics.register();
      $ionicAnalytics.dispatchInterval = 300;

      // Default code needs to be executed
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
  
        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }

      var loadMasterData = function () {
        MasterData.load().then(function () {
          $rootScope.$broadcast('loaded:masterData');
        }, function (err) {
          if (window.cordova && window.cordova.plugins.cordovaToast) {
            cordova.plugins.cordovaToast.showShortBottom('Something went wrong while contacting the server.');
          }
        });
      };

      $rootScope.$on('load:masterData', function () {
        loadMasterData();
      });

      if (window.StatusBar) {
        window.StatusBar.styleDefault();
      }
      if (!!window.localStorage.LOGGEDIN_USER) {
        $ionicHistory.clearCache().then(function () {
          loadMasterData();
          $state.go('tabs.interviews');
        });
      }
      else if (!JSON.parse(window.localStorage.LOGGING_IN_PROGRESS))
      {
        window.localStorage.LOGGING_IN_PROGRESS = true;
        $state.go('login');        
      }

      $cordovaDeeplinks.route({
        '/login': {
          target: 'login',
          parent: 'login'
        }
      }).subscribe(function (match) {
        var jwtToken = match.$args.jwt;
        var splitToken = jwtToken.split(".");
        var decodedUserDetails = atob(splitToken[1]);
        var userObject = JSON.parse(decodedUserDetails);
        var loginName = userObject.login.split("@")[0];
        window.localStorage.API_TOKEN = jwtToken;
        recruitFactory.isRecruiter(loginName, function (response) {
          loggedinUserStore.storeUser(userObject, response);
          window.localStorage.LOGGING_IN_PROGRESS = false;

          $ionicHistory.nextViewOptions({
            disableBack: true,
            historyRoot: true
          });
          $ionicHistory.clearCache().then(function () {
            $rootScope.$broadcast('load:masterData');
            $state.go('tabs.interviews');
          });
        });
      }, function (nomatch) {
        console.log('No matching deep link available', nomatch);
        console.dir(nomatch);
      });
  
    });
  });