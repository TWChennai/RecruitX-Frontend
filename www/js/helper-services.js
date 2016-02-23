angular.module('recruitX')
  .service('skillHelperService', ['$filter', 'MasterData', function ($filter, MasterData) {
    'use strict';

    this.formatAllSkills = function (candidate_skills, other_skills) {
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

  loggedinUserStore.storeUser = function (loggedinUser, is_recruiter) {
    var userDetails = {
      firstName: loggedinUser.profile.firstName,
      id: loggedinUser.profile.login.split('@')[0],
      is_recruiter: is_recruiter
    };

    window.localStorage[STORAGE_KEY] = JSON.stringify(userDetails);
  };

  loggedinUserStore.userId = function () {
    return (JSON.parse(window.localStorage[STORAGE_KEY])).id;
  };

  loggedinUserStore.isRecruiter = function () {
    return (JSON.parse(window.localStorage[STORAGE_KEY])).is_recruiter;
  };

  loggedinUserStore.userFirstName = function () {
    return (JSON.parse(window.localStorage[STORAGE_KEY])).firstName;
  };

  loggedinUserStore.clearDb = function () {
    window.localStorage.removeItem(STORAGE_KEY);
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
