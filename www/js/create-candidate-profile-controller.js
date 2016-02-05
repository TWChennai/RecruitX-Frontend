angular.module('recruitX')
  // TODO: If we need to preload, please implement the same for the other controllers as well. If not, then remove from here
  .controller('createCandidateProfileController', ['$rootScope', '$scope', 'MasterData', function ($rootScope, $scope, MasterData) {
    'use strict';

    $scope.candidate = {};
    $scope.skills = MasterData.getSkills();
    $scope.roles = MasterData.getRoles();

    console.log($scope.skills);

    $scope.isAtleastOnePredefinedSkillSelected = function () {
      var otherCheckBox = $scope.getOtherCheckbox();
      // TODO: There should be a better way in angular to extract with a certain parameter
      angular.forEach($scope.skills, function (value) {
        if (otherCheckBox !== undefined && otherCheckBox.name !== value.name && value.checked) {
          return true;
        }
      });

      return false;
    };

    $scope.getOtherCheckbox = function () {
      // TODO: There should be a better way in angular to extract with a certain parameter
      angular.forEach($scope.skills, function (value) {
        if (value.name === 'Other') {
          return value;
        }
      });
      return undefined;
    };

    $scope.isSkillFieldsValid = function () {
      if (Object.keys($scope.skills).length > 0) {
        var otherCheckBox = $scope.getOtherCheckbox();
        if (otherCheckBox !== undefined && otherCheckBox.checked) {
          return $scope.candidate.other_skills !== undefined;
        } else {
          return $scope.isAtleastOnePredefinedSkillSelected();
        }
      }
      return false;
    };

    $scope.isFormInvalid = function () {
      if (Object.keys($scope.skills).length === 0) {
        return false;
      }
      return !($scope.isSkillFieldsValid() && !$scope.candidateForm.$invalid);
    };

    $scope.processCandidateData = function () {
      $scope.candidate.skill_ids = [];
      $scope.candidate.name = $scope.firstName + ' ' + $scope.lastName;
      // TODO: There should be a better way in angular to extract with a certain parameter
      // TODO: Please use a consistent for construct
      for (var skill in $scope.skills) {
        if ($scope.skills[skill].checked) {
          $scope.candidate.skill_ids.push($scope.skills[skill].id);
        }
      }
    };
  }
]);
