var module = angular.module("bandGalleryDemo");

module.service("ImageService", [function(){
	this.getBandGalleryImgs = function(){
		return [{"url":"img/1.jpg", "title":"Completely responsive", "description":"Play around with the window sizes, the bandGallery will always fit on your view!"},
		 		{"url":"img/2.jpg", "title":"Customizable controll elements", "description":"Don't like the page number on the left bottom? Just set the page-nr attribute to false"},
		 		{"url":"img/3.jpg", "title":"Fresh floating", "description":"Smooth scrolling due to previous and next-buttons on the side"},
		 		{"url":"img/4.jpg", "title" : "Presenting big pictures", "description":"Showing fullscreen images to present all your best!"},
		 		{"url":"img/5.jpg"}];
	}
}]);