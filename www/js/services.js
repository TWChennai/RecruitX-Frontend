angular.module('starter')
  .factory('recruitFactory', ['$rootScope', '$http', function($rootScope, $http) {
    'use strict';

    // base url
    var baseUrl = 'http://10.16.23.187:4000';
    return {
      getRoles: function(success) {
        $http.get(baseUrl + '/roles').success(success);
      },

      getSkills: function(success) {
        $http.get(baseUrl + '/skills').success(success);
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
