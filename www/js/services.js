angular.module('starter')
  .factory('recruitFactory', ['$rootScope', '$http', function ( $rootScope, $http ) {
    // base url
    var baseUrl = 'http://10.16.23.151:4000';
    return {
      /*getSkills: function(response) {
        return $http.get(baseUrl+'/skills').then(function(response){
          return response.data;
        });
      }, */
      getRoles: function(success, error) {
        $http.get(baseUrl+'/roles').success(success);
      },
      getSkills: function(success, error) {
        $http.get(baseUrl+'/skills').success(success);
      },
      getInterviewRounds: function(success, error) {
        $http.get(baseUrl+'/interviews').success(success);
      },
      saveCandidate: function(data, success, error) {
        $http.post(baseUrl+'/candidates',data).success(success).error(error);
      }
    };
  }]);
