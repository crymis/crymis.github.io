var module = angular.module('portingGuide');
module.config(['$routeProvider', function($routeProvider) {
		$routeProvider.
				when("/home", {
					templateUrl: "views/home.html",
					controller: "HomeCtrl"
				}).
				when("/about", {
					templateUrl: "views/about.html"
				}).
				when("/result", {
					templateUrl: "views/result.html",
					controller: "HomeCtrl"
				}).
				otherwise({
					redirectTo: "/home"
				});
	}]);
