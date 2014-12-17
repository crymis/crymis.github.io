var module = angular.module("paymentApp");

module.controller("AppCtrl", ["$scope", function($scope) {
	
	// selection is valid at beginning, if preset!
/*	$scope.sum = 0.0;
	$scope.payer = 0.0;
	$scope.afterPayer = 0.0;
	$scope.solution = 0.0;
*/
	$scope.newStyle = "EPIC MODE";
	$scope.epicMode = false;

	$scope.solution = function(){
		return ($scope.sum - $scope.payer + $scope.afterPayer) / 2;
	};

	$scope.switchStyle = function() {
		$scope.epicMode = !$scope.epicMode;
		if ($scope.newStyle === "EPIC MODE") {
			$scope.newStyle = "NORMAL MODE";
			for (var i = 0; i < document.getElementsByTagName("*").length; i++) {
				document.getElementsByTagName("*")[i].style.color = "#F5EDB5";
				document.getElementsByTagName("*")[i].style.borderColor = "#F5EDB5";
			}
		} else {
			$scope.newStyle = "EPIC MODE";
			for (var i = 0; i < document.getElementsByTagName("*").length; i++) {
				document.getElementsByTagName("*")[i].style.color = "#59575a";
				document.getElementsByTagName("*")[i].style.borderColor = "#59575a";
			}
		}
		
	};

}]);