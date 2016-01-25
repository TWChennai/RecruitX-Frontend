angular.module('starter')
  .factory('recruitFactory', ['$rootScope', '$http', function($rootScope, $http) {
    'use strict';

    // base url
    var baseUrl = 'http://10.134.125.194:4001';
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
