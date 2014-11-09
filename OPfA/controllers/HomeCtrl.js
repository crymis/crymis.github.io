var module = angular.module("portingGuide");

module.controller("HomeCtrl", ["$scope", "$location", function($scope, $location){
	$scope.firstName = "";
	$scope.lastName = "";
	$scope.dateOfBirth = "";
	$scope.placeRange = "Karlsruhe";
	$scope.request = {};
	$scope.result = false;

	$scope.sendRequest = function () {
		$scope.request.firstName = $scope.firstName;
		$scope.request.lastName = $scope.lastName;
		$scope.request.dateOfBirth = $scope.dateOfBirth;
		$scope.request.placeRange = $scope.placeRange;
		$scope.result = true;
	}

	$scope.clearForm = function () {
		$scope.firstName = $scope.lastName = $scope.dateOfBirth = null;
	};


	$scope.goHome = function () {
		$scope.result = false;
		$scope.clearForm();
	}


	$scope.go = function ( path ) {
		$location.path( path );
	};

}]);