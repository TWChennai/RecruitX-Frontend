angular.module('recruitX')
.controller('aboutController', ['$scope', 'dialogService', '$rootScope', '$cordovaToast', 'deployChannel', function($scope, dialogService, $rootScope, $cordovaToast, deployChannel){

  cordova.getAppVersion(function(version) {
    $scope.appVersion = version;
  });

  $scope.checkUpdates = function(){
    if(window.Connection && navigator.connection.type === Connection.NONE) {
      $cordovaToast.showShortBottom('Please check your internet connection');
    }
    else{
      var deploy = new Ionic.Deploy();
      deploy.setChannel(deployChannel);
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
                $rootScope.$broadcast('loading:hide');
                // Load the updated version
                $cordovaToast.showShortBottom('Successfully updated!');
                deploy.load();
              }, function(error) {
                  // Error extracting
                $rootScope.$broadcast('loading:hide');
                $cordovaToast.showShortBottom('Something went wrong. Please try again later');
                console.log('error extracting');
              }, function(progress) {
                  // Do something with the zip extraction progress
                $rootScope.$broadcast('loading:show');
              });
            }, function(error) {
                // Error downloading the updates
              $rootScope.$broadcast('loading:hide');
              if(window.Connection && navigator.connection.type === Connection.NONE) {
                $cordovaToast.showShortBottom('Please check your internet connection');
              }
              else {
                $cordovaToast.showShortBottom('Something went wrong. Please try again later');
              }
              console.log('error downloading updates');
            }, function(progress) {
              // Do something with the download progress
              $rootScope.$broadcast('loading:show');
            });
          });
        }
        else{
          dialogService.showAlert('App Update', 'There are currently no updates available');
        }
      }, function(error) {
           // Error checking for updates
        if(window.Connection && navigator.connection.type === Connection.NONE) {
          $cordovaToast.showShortBottom('Please check your internet connection');
        }
        else {
          $cordovaToast.showShortBottom('Something went wrong. Please try again later');
        }
        console.log('error checking updates');
      });
    }
  };
}]);
