var app = angular.module('timebank', ['ngMaterial']);
app.controller('SidenavController', ($scope, $mdSidenav) => {
    $scope.openLeftMenu = () => {
        $mdSidenav('left').toggle();
    };
});