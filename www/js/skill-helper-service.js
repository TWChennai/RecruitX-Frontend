angular.module('recruitX')
  .service('skillHelperService', function () {
    this.getAllSkills = function (skills, other_skills) {
      var all_skills = [];

      angular.forEach(skills, function (skill) {
        if (skill.name !== 'Other') {
          all_skills.push(skill.name);
        }
      });

      all_skills.push(other_skills);
      return all_skills.join(', ');
    };
  });