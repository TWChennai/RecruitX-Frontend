angular.module('starter')
  .factory('recruitFactory', ['$rootScope', '$http', function($rootScope, $http) {
    'use strict';

    // base url
    // TODO: Move this into a properties/json file that is read in when the app starts
    var baseUrl = 'http://192.168.1.106:4000';
    return {
      getRoles: function(success) {
        $http.get(baseUrl + '/roles').success(success);
      },

      getSkills: function(success) {
        $http.get(baseUrl + '/skills').success(success);
      },

      getCandidates: function(success, error) {
        $http.get(baseUrl + '/candidates').success(success).error(function(err, status){
          console.log('Hey error status is ' + status);
          error();
        });
      },

      getInterviewRounds: function(success) {
        $http.get(baseUrl + '/interviews').success(success);
      },

      saveCandidate: function(data, success, error) {
        $http.post(baseUrl + '/candidates', data).success(success).error(error);
      },
    };
  },
]);
