angular.module('starter')
.controller('createCandidateProfileController', ['$rootScope', '$scope', '$http', 'recruitFactory', function ($rootScope, $scope, $http, recruitFactory) {
  'use strict';

  $scope.candidate = {}, $scope.skills = [], $scope.roles = [];

  recruitFactory.getSkills(function(skills) {
    $scope.skills = skills;
  });

  recruitFactory.getRoles(function(roles) {
    $scope.roles = roles;
  });

  $scope.isAtleastOnePredefinedSkillSelected = function() {
    var validity = false;
    angular.forEach($scope.skills, function(value, key) {
      if ($scope.getOtherCheckbox().name != value.name) {
        validity = value.checked || validity;
      }
    });

    return validity;
  };

  $scope.getOtherCheckbox = function() {
    var otherSkill;
    angular.forEach($scope.skills, function(value, key) {
      if (value.name === 'Other') {
        otherSkill = value;
      }
    });

    return otherSkill;
  };

  $scope.isSkillFieldsValid = function() {
    if (Object.keys($scope.skills).length > 0) {
      var otherCheckBox = $scope.getOtherCheckbox();
      if (otherCheckBox.checked) {
        return $scope.candidate.additional_information !== undefined;
      } else {
        return $scope.isAtleastOnePredefinedSkillSelected();
      }
    }
  };

  $scope.isFormInvalid = function () {
    if (Object.keys($scope.skills).length > 0) {
      var validity = ($scope.isSkillFieldsValid() && !$scope.candidateForm.$invalid);
      return !validity;
    } else {
      return false;
    }
  };

  $scope.processCandidateData = function() {
    $scope.candidate.skill_ids = [];
    $scope.candidate.name = $scope.firstName + ' ' + $scope.lastName;
    for (var skill in $scope.skills) {
      if ($scope.skills[skill].checked) {
        $scope.candidate.skill_ids.push($scope.skills[skill].id);
      }
    }
  };
},
]);
