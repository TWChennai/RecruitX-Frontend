angular.module('recruitX')
  .service('skillHelperService', function () {
    this.formatAllSkills = function (skills, other_skills) {
      var all_skills = [];

      // TODO: Please use a consistent for construct
      angular.forEach(skills, function (skill) {
        if (skill.name !== 'Other') {
          all_skills.push(skill.name);
        }
      });

      all_skills.push(other_skills);
      return all_skills.join(', ');
    };
  })
  .service('oktaSigninWidget', function(endpoints){
      return new OktaSignIn({baseUrl: endpoints.oktaUrl})
  })
  .factory('loggedinUserStore', function() {

  const storageKey = 'LOGGEDIN_USER';
  var loggedinUserStore = {};

  loggedinUserStore.storeUser = function(loggedinUser) {

    var id = loggedinUser.profile.login.split('@')[0];

    window.localStorage[storageKey] = id;
  };

  loggedinUserStore.user = function() {
    return window.localStorage[storageKey];
  };

  return loggedinUserStore;
});
