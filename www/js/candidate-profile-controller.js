angular.module('starter')
  .controller('candidateProfileController', ['$scope', '$stateParams', 'recruitFactory', 'skillHelperService', function($scope, $stateParams, recruitFactory, skillHelperService) {
    'use strict';

    $scope.candidate = {};

    recruitFactory.getCandidate($stateParams.candidate_id, function(response) {
      $scope.candidate = response['data'];
      
      $scope.candidate.all_skills = skillHelperService.getAllSkills($scope.candidate.skills, $scope.candidate.additional_information);
    }, function(response) {
      console.log('failed');
      console.log(response);
    });
  }, ]);
