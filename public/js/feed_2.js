app = angular.module('timebank', ['ngMaterial', 'ngMessages', 'ngSanitize']).config(function($sceProvider) {
    $sceProvider.enabled(false);
  }); 

app.controller("MainController", function($scope, $http) {
    $http.get("/feed_data").then(function(response) {
        console.log(response);
        $scope.product = JSON.stringify(response.json());
    });
});