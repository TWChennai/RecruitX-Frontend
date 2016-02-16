xdescribe('loggedinUserStore', function () {
  'use strict';

  beforeEach(module('recruitX'));
  var loggedinUserStore;
  beforeEach(inject(function (_loggedinUserStore_) {
    loggedinUserStore = _loggedinUserStore_;
  }));

  describe('handle loggedin user info', function () {
    var STORAGE_KEY = 'LOGGEDIN_USER';
    var storedUser = {
      firstName: 'recruitx',
      id: 'recruit',
      is_recruiter: true
    };

    it('should store a user that is logging in', function () {
      window.localStorage.removeItem(STORAGE_KEY);
      var incomingUser = {
        'id': '1241kjhhlkj634345',
        'profile': {
          'login': 'recruit@thoughtworks.com',
          'firstName': 'recruitx',
          'lastName': 'user'
        }
      };

      loggedinUserStore.storeUser(incomingUser, true);
      expect(window.localStorage[STORAGE_KEY]).toEqual(JSON.stringify(storedUser));
    });

    it('should be able to get the loggedin user id', function () {
      window.localStorage[STORAGE_KEY] = JSON.stringify(storedUser);
      expect(loggedinUserStore.userId()).toEqual('recruit');
    });

    it('should be able to get the loggedin user name', function () {
      window.localStorage[STORAGE_KEY] = JSON.stringify(storedUser);
      expect(loggedinUserStore.userFirstName()).toEqual('recruitx');
    });

    it('should be able to delete the loggedin user information', function () {
      window.localStorage[STORAGE_KEY] = JSON.stringify(storedUser);
      loggedinUserStore.clearDb();
      expect(window.localStorage[STORAGE_KEY]).toBe(undefined);
    });

    it('should be able to find if the role', function () {
      window.localStorage[STORAGE_KEY] = JSON.stringify(storedUser);
      expect(loggedinUserStore.isRecruiter()).toBe(true);
    });
  });
});
