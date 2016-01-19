angular.module('starter')

.controller('createCandidateProfileController', function ($scope) {
  'use strict';

  $scope.candidate = {};

  $scope.skills =[
    {id: 1, name: "Java"},
    {id: 2, name: "Ruby"},
    {id: 3, name: "C#"},
    {id: 4, name: "Python"},
    {id: 5, name: "Please specify"}
  ];
  $scope.candidate.skill_ids = [];

  $scope.roles= [
    {id: 1, name: "Dev"},
    {id: 2, name: "QA"},
    {id: 3, name: "BA"},
    {id: 4, name: "PM"},
    {id: 5, name: "UI/UX"}
  ];

  $scope.isAtleastOnePredefinedSkillSelected = function(){
      var validity = false;
      angular.forEach( $scope.skills, function(value, key){
        if($scope.getOtherCheckbox().name != value.name) {
          validity = value.checked || validity;
        }
      });
      return validity;
  };

  $scope.getOtherCheckbox = function(){
    var otherSkill;
    angular.forEach($scope.skills, function(value, key){
      if(value.name == "Please specify")
        otherSkill = value;
    });
    return otherSkill;
 };

  $scope.isSkillFieldsValid = function(){
    var otherCheckBox = $scope.getOtherCheckbox();
    if(otherCheckBox.checked)
      return $scope.candidate.additional_information !== undefined;
    else
      return $scope.isAtleastOnePredefinedSkillSelected();
  };

  $scope.isFormInvalid = function () {
    var validity = ($scope.isSkillFieldsValid() && !$scope.candidateForm.$invalid);
    return !validity;
};

  $scope.processCandidateData = function(){
      $scope.candidate.name = $scope.firstName + " " + $scope.lastName;
      for(var skill in $scope.skills){
          if($scope.skills[skill].checked){
             $scope.candidate.skill_ids.push($scope.skills[skill].id);
          }
      }
  };
});
