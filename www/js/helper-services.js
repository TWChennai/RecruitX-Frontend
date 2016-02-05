angular.module('recruitX')
  .service('skillHelperService', function ($filter, MasterData) {
    'use strict';

    this.formatAllSkills = function (candidate_skills, other_skills) {
      var all_skills = [];
      var skills = MasterData.getSkills();

      // TODO: Please use a consistent for construct
      angular.forEach(candidate_skills, function (skill) {
        // TODO: Hard-coding a magic number doesn't convey the meaning. Move this to app.js where the skills are loaded for the first time.
        var other_skill_id = 5;
        if (skill.id !== other_skill_id) {
          var role = ($filter('filter')(skills, {
            id: skill.id
          }))[0];
          all_skills.push(role.name);
        }
      });
      all_skills.push(other_skills);
      return all_skills.join(', ');
    };
  })

  .service('oktaSigninWidget', function (endpoints) {
    return new OktaSignIn({
      baseUrl: endpoints.oktaUrl,
      labels: {
        'primaryauth.title': 'RecruitX',
        'primaryauth.username.tooltip': 'Enter your Okta username or email id',
        'primaryauth.password.tooltip': 'Enter your Okta password'
      }
    });
  })

  .factory('loggedinUserStore', function () {
    const storageKey = 'LOGGEDIN_USER';
    var loggedinUserStore = {};

    loggedinUserStore.storeUser = function (loggedinUser) {
      var userDetails = {
        firstName: loggedinUser.profile.firstName,
        id: loggedinUser.profile.login.split('@')[0]
      }

      window.localStorage[storageKey] = JSON.stringify(userDetails);
    };

    loggedinUserStore.userId = function () {
      return (JSON.parse(window.localStorage[storageKey])).id;
    };

    loggedinUserStore.userFirstName = function () {
      return (JSON.parse(window.localStorage[storageKey])).firstName;
    };

    return loggedinUserStore;
  })

  .factory('Camera', ['$q', function ($q) {
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
    }
  }])

  .factory('ionicLoadingService', function ($ionicLoading){
    return {
      showLoading: function () {
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
      }, stopLoading: function (){
        $ionicLoading.hide();
      }
    }
  })

  .factory('alertService', function($ionicPopup){
    return {
      showAlert: function(alertTitle, alertText){
        $ionicPopup.alert({
          title: alertTitle,
          template: alertText
        });
      }, showAlertWithDismissHandler: function(alertTitle, alertText, onAlertDismiss){
        $ionicPopup.alert({
          title: alertTitle,
          template: alertText
        }).then(function(res) {
          onAlertDismiss();
        });;
      }
    }
  });
