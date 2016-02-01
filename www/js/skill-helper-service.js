angular.module('starter')
       .service('skillHelperService', function() {
            this.getAllSkills = function(skills, other_skills){
             var all_skills = [];

             // TODO: Isn't there a better way to join an array of elements with a delimiter?
             angular.forEach(skills, function(skill){
                all_skills.push(skill.name);
             });

             all_skills.push(other_skills);
             console.log("skills" + String(all_skills));
             return String(all_skills);
         }
       });
