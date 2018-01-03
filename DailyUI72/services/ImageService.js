var module = angular.module("bandGalleryDemo");

module.service("ImageService", [function(){
	this.getBandGalleryImgs = function(){
		return [{"url":"img/1.jpg", "title":"Day #072", "description":"Image Slider"},
		 		{"url":"img/2.jpg"},
		 		{"url":"img/3.jpg"},
				{"url":"img/4.jpg"},
				{"url":"img/5.jpg", "title":"Completely responsive", "description":"Play around with the window sizes, the bandGallery will always fit on your view!"}
			];
	}
}]);