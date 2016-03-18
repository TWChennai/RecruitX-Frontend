angular.module('recruitX')
.controller('aboutController', ['$scope', 'dialogService', '$rootScope', function($scope, dialogService, $rootScope){

  cordova.getAppVersion(function(version) {
    $scope.appVersion = version;
  });

  $scope.checkUpdates = function(){
    var deploy = new Ionic.Deploy();
// Check for updates
    deploy.check().then(function(response) {
  // response will be true/false
      if (response) {
        dialogService.askConfirmation('App Update', 'There is an update available. Do you want to install it?', function(){
    // Download the updates
          deploy.download().then(function() {
            $rootScope.$broadcast('loading:hide');
      // Extract the updates
            deploy.extract().then(function() {
        // Load the updated version
              $rootScope.$broadcast('loading:hide');
              deploy.load();
            }, function(error) {
              $rootScope.$broadcast('loading:hide');
              console.log('error extracting');
        // Error extracting
            }, function(progress) {
              $rootScope.$broadcast('loading:show');
        // Do something with the zip extraction progress
            });
          }, function(error) {
            $rootScope.$broadcast('loading:hide');
            console.log('error downloading updates');
      // Error downloading the updates
          }, function(progress) {
            $rootScope.$broadcast('loading:show');
      // Do something with the download progress
          });
        });
      }
      else{
        dialogService.showAlert('App Update', 'There are currently no updates available');
      }
    }, function(error) {
      console.log('error checking updates');
  // Error checking for updates
    });
  };
}]);
