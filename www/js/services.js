angular.module('starter')
.factory('recruitFactory', ['$cordovaToast', '$http', 'apiUrl', function($cordovaToast, $http, apiUrl) {
  'use strict';

  var baseUrl = 'http://' + apiUrl;

  var getErrorMessage = function(status) {
    switch(status){
      default:
        return 'Something went wrong while processing your request.Please try again soon';
    }
  };

  var defaultErrorHandler = function(err, status, customError){
    $cordovaToast.showShortBottom(getErrorMessage(status));
//    console.log(getErrorMessage(status));
    customError();
  };

  return {
    getRoles: function(success) {
      $http.get(baseUrl + '/roles').success(success).error(defaultErrorHandler);
    },

    getSkills: function(success) {
      $http.get(baseUrl + '/skills').success(success).error(defaultErrorHandler);
    },

    getCandidates: function(success, customError) {
      $http.get(baseUrl + '/candidates').success(success).error(function(err, status){
        defaultErrorHandler(err, status, customError);
      });
    },

    getInterviewRounds: function(success) {
      $http.get(baseUrl + '/interview_types').success(success).error(defaultErrorHandler);
    },

    saveCandidate: function(data, success) {
      $http.post(baseUrl + '/candidates', data).success(success).error(defaultErrorHandler);
    },

    getCandidateInterviewSchedule: function(success) {
      $http.get(baseUrl + '/candidate_interview_schedules').success(success).error(defaultErrorHandler);
    },
  };
}]
);
