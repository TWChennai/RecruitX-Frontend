angular.module('starter')
.factory('recruitFactory', ['$cordovaToast', '$http', function($cordovaToast, $http) {
  'use strict';

  // base url
  // TODO: Move this into a properties/json file that is read in when the app starts
  var baseUrl = 'http://192.168.1.106:4000';

  var getErrorMessage = function(status) {
    switch(status){
      default:
        return 'Something went wrong while processing your request.Please try again soon';
    }
  };

  var defaultErrorHandler = function(err, status, customError){
    $cordovaToast.showShortBottom(getErrorMessage(status));
    console.log(getErrorMessage(status));
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
      $http.get(baseUrl + '/interviews').success(success).error(defaultErrorHandler);
    },

    saveCandidate: function(data, success) {
      $http.post(baseUrl + '/candidates', data).success(success).error(defaultErrorHandler);
    },
  };
}]
);
