angular.module('recruitX')
  .service('skillHelperService', function ($rootScope) {
    'use strict';
    this.getAllSkills = function (skills, other_skills) {
      var all_skills = [];

      angular.forEach(skills, function (skill) {
        var other_skill_id = 5;
        if (skill.id !== other_skill_id) {
          var role = $rootScope.skills[skill.id];
          all_skills.push(role.name);
        }
      });

      all_skills.push(other_skills);
      return all_skills.join(', ');
    };
  });
