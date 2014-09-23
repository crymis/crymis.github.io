var module = angular.module("paymentApp");

module.controller("AppCtrl", ["$scope", function($scope) {
	
	// selection is valid at beginning, if preset!
/*	$scope.sum = 0.0;
	$scope.payer = 0.0;
	$scope.afterPayer = 0.0;
	$scope.solution = 0.0;
*/
	$scope.solution = function(){
		return ($scope.sum - $scope.payer + $scope.afterPayer) / 2;
	}

}]);