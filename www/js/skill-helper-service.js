angular.module('recruitX')
  .service('skillHelperService', function (MasterData) {
    'use strict';
    this.getAllSkills = function (candidate_skills, other_skills) {
      var all_skills = [];
      var skills = MasterData.getSkills();
      console.log(skills);

      angular.forEach(candidate_skills, function (skill) {
        // TODO: Hard-coding a magic number doesn't convey the meaning. Move this to app.js where the skills are loaded for the first time.
        var other_skill_id = 5;
        if (skill.id !== other_skill_id) {
          var role = skills[skill.id];
          all_skills.push(role.name);
        }
      });

      all_skills.push(other_skills);
      return all_skills.join(', ');
    };
  });
