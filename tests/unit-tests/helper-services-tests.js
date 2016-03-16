describe('helper-services', function () {
  'use strict';

  beforeEach(module('recruitX'));

  var loggedinUserStore;
  var skillHelperService;

  beforeEach(inject(function (_loggedinUserStore_, _skillHelperService_) {
    loggedinUserStore = _loggedinUserStore_;
    skillHelperService = _skillHelperService_;
  }));

  describe('handle loggedin user info', function () {
    var STORAGE_KEY = 'LOGGEDIN_USER';
    var storedUser = {
      firstName: 'recruitx',
      id: 'recruit',
      is_recruiter: true,
      tw_hire_date: '2015-11-11',
      past_experience: 1.23
    };
    var userDetails = {
      is_recruiter: true,
      tw_hire_date: '2015-11-11',
      past_experience: 1.23
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

      loggedinUserStore.storeUser(incomingUser, userDetails);
      expect(window.localStorage[STORAGE_KEY]).toEqual(JSON.stringify(storedUser));
    });

    describe('should get value from store', function() {
      window.localStorage[STORAGE_KEY] = JSON.stringify(storedUser);

      it('should be able to get the loggedin user id', function () {
        expect(loggedinUserStore.userId()).toEqual('recruit');
      });

      it('should be able to get the loggedin user name', function () {
        expect(loggedinUserStore.userFirstName()).toEqual('recruitx');
      });

      it('should be able to find if the role', function () {
        expect(loggedinUserStore.isRecruiter()).toBe(true);
      });

      it('should be able to find if the pastExperience', function () {
        expect(loggedinUserStore.pastExperience()).toBe(1.23);
      });

      it('should be able to find if the twHireDate', function () {
        expect(loggedinUserStore.twHireDate()).toBe('2015-11-11');
      });

      it('should be able to delete the loggedin user information', function () {
        loggedinUserStore.clearDb();
        expect(window.localStorage[STORAGE_KEY]).toBe(undefined);
      });
    });
  });
  describe('constructRoleSkillsMap', function () {
    it('should return a map of skills for the respective role', function () {
      var roleSkillsMap = {};
      var allSkills = [{
        'name': 'Java',
        'id': 1
      }, {
        'name': 'Ruby',
        'id': 2
      }, {
        'name': 'C#',
        'id': 3
      }, {
        'name': 'Python',
        'id': 4
      }, {
        'name': 'Other',
        'id': 5
      }, {
        'name': 'Selenium',
        'id': 6
      }, {
        'name': 'QTP',
        'id': 7
      }, {
        'name': 'Performance',
        'id': 8
      }, {
        'name': 'SOAPUI',
        'id': 9
      }];
      var roleSkills = [{
        'skill_id': 1,
        'role_id': 1
      }, {
        'skill_id': 2,
        'role_id': 1
      }, {
        'skill_id': 3,
        'role_id': 1
      }, {
        'skill_id': 4,
        'role_id': 1
      }, {
        'skill_id': 5,
        'role_id': 1
      }, {
        'skill_id': 6,
        'role_id': 2
      }, {
        'skill_id': 7,
        'role_id': 2
      }, {
        'skill_id': 8,
        'role_id': 2
      }, {
        'skill_id': 9,
        'role_id': 2
      }, {
        'skill_id': 5,
        'role_id': 2
      }];
      var expectedRoleSkillsMap = {
        1: [{
          'name': 'Java',
          'id': 1
        }, {
          'name': 'Ruby',
          'id': 2
        }, {
          'name': 'C#',
          'id': 3
        }, {
          'name': 'Python',
          'id': 4
        }, {
          'name': 'Other',
          'id': 5
        }],
        2: [{
          'name': 'Selenium',
          'id': 6
        }, {
          'name': 'QTP',
          'id': 7
        }, {
          'name': 'Performance',
          'id': 8
        }, {
          'name': 'SOAPUI',
          'id': 9
        }, {
          'name': 'Other',
          'id': 5
        }]
      };

      roleSkillsMap = skillHelperService.constructRoleSkillsMap(roleSkills, allSkills);

      expect(angular.equals(roleSkillsMap, expectedRoleSkillsMap)).toBe(true);
    });
  });
});
