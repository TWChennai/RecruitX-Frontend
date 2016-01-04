describe('createCandidateProfileController', function(){
  beforeEach(module('starter'));

  var $controller;
   beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  describe('validateForm', function() {
    it('should return true when no checkbox is checked', function() {
      var $scope = {};
      var controller = $controller('createCandidateProfileController', { $scope: $scope });
      expect($scope.validateForm()).toEqual(true);
    });

    it('should return true when any checkbox is checked, other than \'other\' checkbox and form is invalid', function() {
      var $scope = {};
      var controller = $controller('createCandidateProfileController', { $scope: $scope });
      $scope.candidateForm = {
        $invalid: true
      };
      $scope.candidate.java = true;
      expect($scope.validateForm()).toEqual(true);
    });

    it('should return false when checkbox is checked and form is valid', function() {
      var $scope = {};
      var controller = $controller('createCandidateProfileController', { $scope: $scope });
      $scope.candidateForm = {
        $invalid: false
      };
      $scope.candidate.other = true;
      expect($scope.validateForm()).toEqual(false);
    });
  });
});
