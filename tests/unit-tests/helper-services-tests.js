describe('helper-services', function () {
  'use strict';

  beforeEach(module('recruitX'));

  var loggedinUserStore, skillHelperService, MasterData, interviewTypeHelperService;

  beforeEach(inject(function (_loggedinUserStore_, _skillHelperService_, _MasterData_, _interviewTypeHelperService_) {
    loggedinUserStore = _loggedinUserStore_;
    skillHelperService = _skillHelperService_;
    MasterData = _MasterData_;
    interviewTypeHelperService = _interviewTypeHelperService_;
  }));

  describe('handle loggedin user info', function () {
    var STORAGE_KEY = 'LOGGEDIN_USER';
    var storedUser = {
      firstName: 'recruitx',
      id: 'recruit',
      is_recruiter: true,
      calculated_hire_date: '2015-11-11',
      past_experience: 1.23,
      office: 'Chennai',
      role: { name: 'Other',id: 3}
    };
    var userDetails = {
      is_recruiter: true,
      calculated_hire_date: '2015-11-11',
      past_experience: 1.23,
      office: 'Chennai',
      role: { name: 'Other',id: 3}
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

      it('should be able to find office', function(){

        expect(loggedinUserStore.office()).toBe('Chennai');
      });

      it('should be able to find if the pastExperience', function () {
        var expected_experience = 1.23;
        expect(loggedinUserStore.pastExperience()).toBe(expected_experience);
      });

      it('should be able to find if the calculatedHireDate', function () {
        expect(loggedinUserStore.calculatedHireDate()).toBe('2015-11-11');
      });

      it('should be able to calculate total experience from hire date and past experience', function () {
        var two_years_back = new Date();
        two_years_back.setDate(two_years_back.getDate() - (2*365));
        spyOn(loggedinUserStore, 'calculatedHireDate').and.returnValue(two_years_back);
        spyOn(loggedinUserStore, 'pastExperience').and.returnValue(1.5243);

        expect(loggedinUserStore.experience()).toBe(3.52);
      });

      it('should be able to get logged-in user role', function () {
        var role = loggedinUserStore.role();
        expect(role.name).toBe('Other');
        expect(role.id).toBe(3);
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
        'name': 'Selenium',
        'id': 6
      }, {
        'name': 'QTP',
        'id': 7
      }];
      var roles = [{
        'id': 1,
        'name': 'Dev',
        'skills': [{
          'id': 1
        }, {
          'id': 2
        }]
      }, {
        'id': 2,
        'name': 'QA',
        'skills': [{
          'id': 6
        }, {
          'id': 7
        }]
      }];
      var expectedRoleSkillsMap = {
        1: [{
          'name': 'Java',
          'id': 1
        }, {
          'name': 'Ruby',
          'id': 2
        }],
        2: [{
          'name': 'Selenium',
          'id': 6
        }, {
          'name': 'QTP',
          'id': 7
        }]
      };

      roleSkillsMap = skillHelperService.constructRoleSkillsMap(roles, allSkills);

      expect(angular.equals(roleSkillsMap, expectedRoleSkillsMap)).toBe(true);
    });
  });
  describe('constructRoleInterviewTypesMap', function () {
    it('should return a map of interview_types for the respective role', function () {
      var interviewTypes = [{
        'name': 'Java',
        'id': 1
      }, {
        'name': 'Ruby',
        'id': 2
      }, {
        'name': 'Selenium',
        'id': 6
      }, {
        'name': 'QTP',
        'id': 7
      }];
      var roles = [{
        'id': 1,
        'name': 'Dev',
        'interview_types': [{
          'id': 1
        }, {
          'id': 2
        }]
      }, {
        'id': 2,
        'name': 'QA',
        'interview_types': [{
          'id': 6
        }, {
          'id': 7
        }]
      }];
      var expectedRoleSkillsMap = [{
        'name': 'Java',
        'id': 1
      }, {
        'name': 'Ruby',
        'id': 2
      }];
      spyOn(MasterData, 'getRoles').and.returnValue(roles);
      spyOn(MasterData, 'getInterviewTypes').and.returnValue(interviewTypes);

      var roleInterviewTypesMap = interviewTypeHelperService.constructRoleInterviewTypesMap(1);

      expect(angular.equals(roleInterviewTypesMap, expectedRoleSkillsMap)).toBe(true);
    });
  });
});
