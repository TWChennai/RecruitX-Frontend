angular.module('recruitX')
.controller('aboutController', ['$scope', 'dialogService', function($scope, dialogService){
  $scope.checkUpdates = function(){
    var deploy = new Ionic.Deploy();
    console.log('initialised');
// Check for updates
    deploy.check().then(function(response) {
  // response will be true/false
      if (response) {
        dialogService.askConfirmation('App Update', 'There is an update available. Do you want to install it?', function(){
    // Download the updates
          deploy.download().then(function() {
      // Extract the updates
            deploy.extract().then(function() {
        // Load the updated version
              deploy.load();
            }, function(error) {
              console.log('error extracting');
        // Error extracting
            }, function(progress) {
        // Do something with the zip extraction progress
            });
          }, function(error) {
            console.log('error downloading updates');
      // Error downloading the updates
          }, function(progress) {
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
