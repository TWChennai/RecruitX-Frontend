describe('loginController', function () {
  'use strict';

  beforeEach(module('recruitX'));

  describe('', function () {

    var createController, scope, userStore, validUser, state, history, cordova;
    var clearCacheCalled;
    beforeEach(inject(function ($controller, $rootScope) {
      validUser = {
        'id': '1241kjhhlkj634345',
        'profile': {
          'login': 'recruitx@thoughtworks.com',
          'firstName': 'recruit',
          'lastName': 'user'
        }
      };

      scope = $rootScope.$new();
      userStore = {
        storeUser: function () {},
        userId: function() {}
      };
      clearCacheCalled = false;
      history = {
        nextViewOptions: function () {},
        clearCache: function () {
          clearCacheCalled = true;
          return {
            then: function () {}
          };
        }
      };
      state = {
        go: function () {}
      };
      createController = function () {
        return $controller('loginController', {
          $scope: scope,
          loggedinUserStore: userStore,
          $state: state,
          $ionicHistory: history,
          cordova: cordova
        });
      };
    }));

    describe('constructor', function () {
      it('should check for user login and if loggedIn, redirect to home page', function () {
        spyOn(userStore, 'userId').and.returnValue('recruitx');
        spyOn(state, 'go');
        spyOn(history, 'nextViewOptions');

        createController();

        expect(userStore.userId).toHaveBeenCalled();
        expect(history.nextViewOptions).toHaveBeenCalledWith({
          disableBack: true,
          historyRoot: true
        });
        expect(clearCacheCalled).toBe(true);
      });

      it('should check for user login and if not loggedIn, do nothing', function () {
        spyOn(userStore, 'userId')
        spyOn(state, 'go');
        spyOn(history, 'nextViewOptions');

        createController();

        expect(userStore.userId).toHaveBeenCalled();
        expect(history.nextViewOptions).not.toHaveBeenCalled();
        expect(clearCacheCalled).toBe(false);
      });  
    });

    describe('login function', function () {
      it('should check for user login and if loggedIn, redirect to home page', function () {
        createController();
        spyOn(userStore, 'userId').and.returnValue('recruitx');
        spyOn(state, 'go');
        spyOn(history, 'nextViewOptions');

        scope.login();

        expect(userStore.userId).toHaveBeenCalled();
        expect(history.nextViewOptions).toHaveBeenCalledWith({
          disableBack: true,
          historyRoot: true
        });
        expect(clearCacheCalled).toBe(true);
      });
      it('should check for user login and if not loggedIn, redirect to InAppBrowser', function () {
        var actualURL, actualArg;
        cordova = {
          InAppBrowser: {
            open: function (url, arg) {
              actualURL = url
              actualArg = arg
            }
          }
        }
        createController();
        spyOn(userStore, 'userId');

        scope.login();
        expect(userStore.userId).toHaveBeenCalled();
        expect(actualURL).toBe('@@oktaUrl');
        expect(actualArg).toBe('_system');
      })
    });
  });
});
