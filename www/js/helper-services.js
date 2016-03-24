angular.module('recruitX')
  .service('interviewTypeHelperService', ['$filter', 'MasterData', function ($filter, MasterData) {
    'use strict';

    return {
      constructRoleInterviewTypesMap: function(current_roleId){
        var roleInterviewTypesMap = {};
        var roles = MasterData.getRoles();
        var allInterviewTypes = MasterData.getInterviewTypes();
        for (var roleIndex in roles) {
          var role = roles[roleIndex];
          var roleId = role.id;
          for (var interviewTypeIndex in role.interview_types) {
            var interviewTypeId = role.interview_types[interviewTypeIndex].id;
            if (roleId in roleInterviewTypesMap) {
              roleInterviewTypesMap[roleId].push (($filter ('filter')(allInterviewTypes, {
                id: interviewTypeId
              }))[0]);
            } else {
              roleInterviewTypesMap[roleId] = ($filter ('filter')(allInterviewTypes, {
                id: interviewTypeId
              }));
            }
          }
        }
        return roleInterviewTypesMap[current_roleId];
      }
    };
  }])

  .service('skillHelperService', ['$filter', 'MasterData', function ($filter, MasterData) {
    'use strict';

    return {
      formatAllSkills: function (candidate_skills, other_skills) {
        var all_skills = [];
        var skills = MasterData.getSkills();

        for(var candidateSkillIndex in candidate_skills){
          // TODO: Hard-coding a magic number doesn't convey the meaning. Move this to app.js where the skills are loaded for the first time.
          var other_skill_id = 5;
          var candidateSkill = candidate_skills[candidateSkillIndex];
          if (candidateSkill.id !== other_skill_id) {
            var role = ($filter('filter')(skills, {
              id: candidateSkill.id
            }))[0];
            all_skills.push(role.name);
          }
        }

        if (other_skills !== undefined && other_skills !== null && other_skills.trim().length > 0) {
          all_skills.push(other_skills);
        }

        return all_skills.join(', ');
      },
      constructRoleSkillsMap: function(roles, allSkills){
        var roleSkillsMap = {};
        for (var roleIndex in roles) {
          var role = roles[roleIndex];
          var roleId = role.id;
          for (var skillIndex in role.skills) {
            var skillId = role.skills[skillIndex].id;
            if (roleId in roleSkillsMap) {
              roleSkillsMap[roleId].push (($filter ('filter')(allSkills, {
                id: skillId
              }))[0]);
            } else {
              roleSkillsMap[roleId] = ($filter ('filter')(allSkills, {
                id: skillId
              }));
            }
          }
        }
        return roleSkillsMap;
      }
    };
  }
])

.service('oktaSigninWidget', function (oktaUrl) {
  'use strict';

  return new OktaSignIn({
    baseUrl: oktaUrl,
    labels: {
      'primaryauth.title': 'RecruitX',
      'primaryauth.username.tooltip': 'Enter your Okta username or email id',
      'primaryauth.password.tooltip': 'Enter your Okta password'
    }
  });
})

.factory('loggedinUserStore', function () {
  'use strict';

  var STORAGE_KEY = 'LOGGEDIN_USER';
  var loggedinUserStore = {};

  loggedinUserStore.storeUser = function (loggedinUser, user) {
    var userDetails = {
      firstName: loggedinUser.profile.firstName,
      id: loggedinUser.profile.login.split('@')[0],
      is_recruiter: user.is_recruiter,
      calculated_hire_date: user.calculated_hire_date,
      past_experience: user.past_experience,
      role: user.role
    };

    window.localStorage[STORAGE_KEY] = JSON.stringify(userDetails);
  };

  loggedinUserStore.userId = function () {
    return (JSON.parse(window.localStorage[STORAGE_KEY])).id;
  };

  loggedinUserStore.isRecruiter = function () {
    return (JSON.parse(window.localStorage[STORAGE_KEY])).is_recruiter;
  };

  loggedinUserStore.pastExperience = function () {
    return (JSON.parse(window.localStorage[STORAGE_KEY])).past_experience;
  };

  loggedinUserStore.calculatedHireDate = function () {
    return (JSON.parse(window.localStorage[STORAGE_KEY])).calculated_hire_date;
  };

  loggedinUserStore.userFirstName = function () {
    return (JSON.parse(window.localStorage[STORAGE_KEY])).firstName;
  };

  loggedinUserStore.role = function () {
    return (JSON.parse(window.localStorage[STORAGE_KEY])).role;
  };

  loggedinUserStore.clearDb = function () {
    window.localStorage.removeItem(STORAGE_KEY);
  };

  // Note: Though this value is present in the b/e, we are storing the calculated date in the mobile local storage
  // since the user might not logout, thus experience will never change - but we need it to change
  loggedinUserStore.experience = function () {
    var oneYear = 24*60*60*1000*365;
    var now = new Date();
    var hireDate = new Date(loggedinUserStore.calculatedHireDate());
    var experience = (now.getTime() - hireDate.getTime())/oneYear;
    return parseFloat((experience + parseFloat(loggedinUserStore.pastExperience())).toFixed(2));
  };

  return loggedinUserStore;
})

.factory('Camera', ['$q', function ($q) {
  'use strict';

  return {
    getPicture: function (options) {
      var q = $q.defer();
      navigator.camera.getPicture(function (result) {
        q.resolve(result);
      }, function (err) {
        q.reject(err);
      }, options);

      return q.promise;
    }
  };
}])

.factory('ionicLoadingService', function ($ionicLoading) {
  'use strict';

  return {
    showLoading: function () {
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
    },
    stopLoading: function () {
      $ionicLoading.hide();
    }
  };
})

.factory('dialogService', function ($ionicPopup) {
  'use strict';

  return {
    showAlert: function (alertTitle, alertText) {
      var alert = $ionicPopup.alert({
        title: alertTitle,
        template: alertText
      });
      return alert;
    },
    showAlertWithDismissHandler: function (alertTitle, alertText, onAlertDismiss) {
      $ionicPopup.alert({
        title: alertTitle,
        template: alertText
      }).then(function () {
        onAlertDismiss();
      });
    },
    askConfirmation: function (confirmTitle, confirmText, onOkPress) {
      $ionicPopup.confirm({
        title: confirmTitle,
        template: confirmText,
        cancelType: 'button-positive'
      })
      .then(function (res) {
        if (res) {
          onOkPress();
        }
      });
    }
  };
});
