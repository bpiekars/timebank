//import { userInfo } from "os";

//const mongoose = require('mongoose');



app = angular.module('timebank', ['ngMaterial', 'ngMessages', 'ngSanitize']).config(function($sceProvider) {
    // Completely disable SCE.  For demonstration purposes only!
    // Do not use in new projects.
    $sceProvider.enabled(false);
  }); 
 // app = angular.module("timebank", ['ngMaterial', 'ngMessages', 'ngSanitize']);

//app = angular.module("timebank", ['ngMaterial', 'ngMessages']);

/*app.controller("MainController", function($scope) {
    var strings = ["I posted this", "I posted that", "I posted another thing."]
    var finalHTML = "";
    for (x in strings) {
        //finalHTML += "<div class='row'><div class='col-md-3'><div class='card'><div class='card-body'><div class='h5'>" + "use!" + "</div><div class='h7 text-muted'>"+ x + "</div></div></div></div>";
        finalHTML += "<div>hello</div>";
    }
    $scope.product = finalHTML;
}) */



app.controller("MainController", function($scope, $http) {
    $scope.product = "h";
    /*$http.post('/feed_data').then(function(response) {
        console.log(response);
        console.log("posted successfully!");
        $scope.product = response.data;
    }) */
    $http.get("/feed_data").then(function(response) {
        console.log(response);
        $scope.product = JSON.stringify(response.json());
    });
});

/*app.controller("MainController", function($scope, $http){

    console.log("wtf");
  
  // the array which represents the list
  $scope.items = ["1. Scroll the list to load more"];
  $scope.loading = true;
  
  // this function fetches a random text and adds it to array
  $scope.more = function(){
    /*$http({
      method: "GET",
      url: "https://baconipsum.com/api/?type=all-meat&paras=2&start-with-lorem=1"
    }).then(function(data, status, header, config){
      
     var data = ["p", "a", "b", "d"];
      // returned data contains an array of 2 sentences
      for(line in data){
        newItem = ($scope.items.length+1)+". "+data[line];
        $scope.items.push(newItem);
      }
      $scope.loading = false;
    }
  
  // we call the function twice to populate the list
  $scope.more();
});

// we create a simple directive to modify behavior of <ul>
app.directive("whenScrolled", function(){
  return{
    restrict: 'A',
    link: function(scope, elem, attrs){
    console.log("wtfff~");
      // we get a list of elements of size 1 and need the first element
      raw = elem[0];
    
      // we load more elements when scrolled past a limit
      elem.bind("scroll", function(){
        if(raw.scrollTop+raw.offsetHeight+5 >= raw.scrollHeight){
          scope.loading = true;
          
        // we can give any function which loads more elements into the list
          scope.$apply(attrs.whenScrolled);
        }
      });
    }
  }
}); */