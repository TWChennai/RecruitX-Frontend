angular.module('starter')

.controller('createCandidateProfileController', function ($scope) {
  'use strict';

  $scope.candidate = {};

  $scope.candidate.skills =[
    {name: "Java"},
    {name: "Ruby"},
    {name: "C#"},
    {name: "Python"},
    {name: "Please specify"}
  ];

  $scope.roles= ["Dev", "QA", "BA"];

  $scope.isAtleastOnePredefinedSkillSelected = function(){
      var validity = false;
      angular.forEach( $scope.candidate.skills, function(value, key){
        if($scope.getOtherCheckbox().name != value.name) {
          validity = value.checked || validity;
        }
      });
      return validity;
  }

  $scope.getOtherCheckbox = function(){
    var otherSkill;
    angular.forEach($scope.candidate.skills, function(value, key){
      if(value.name == "Please specify")
        otherSkill = value;
    });
    return otherSkill;
  }

  $scope.isSkillFieldsValid = function(){
    var otherCheckBox = $scope.getOtherCheckbox();
    if(otherCheckBox.checked == true)
      return otherCheckBox.detail != undefined;
    else
      return $scope.isAtleastOnePredefinedSkillSelected();
  }

  $scope.isFormInvalid = function () {
    var validity = ($scope.isSkillFieldsValid() && !$scope.candidateForm.$invalid);
    return !validity;
  }
});
