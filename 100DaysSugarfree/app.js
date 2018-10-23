/* #############################
*  ### CONFIG YOUR CHALLENGE ###
* ############################# */

// start date
const day = 3;
const month = 9;
const year = 2018;

// days of pause
const pauseDays = 7 + 1; // conferencesW1: 6.09-12.09 + Köln: 21.10

// topic
const topic = 'Sugarfree';
const imagesQuery = 'sugar';

// quotes
const quotes = [
	'So much sugar!',
	'Candy',
	'Delicious, tasty food',
	'All those colors',
	'Honey',
	'Sirup',
	'Choclate',
	'White bread',
	'Skittles',
	'Yummie',
	'Sweeter than nutella'
];




/* #############################
*  ### CODE ###
* ############################# */

// calculate date
var start = Math.floor(new Date(year, month - 1, day - 1).getTime()/1000/60/60/24);
var now = Math.floor(new Date().getTime()/1000/60/60/24);
var days = now - start - 2 - pauseDays;
var togo = "";
// count down until 100 days are reached, then count up.
if (days <= 100) {
	days = 100 - days;
	togo = " to go"
} else {
	days = 0;
}

// set default image and error text
document.getElementById("bg").setAttribute("style", `background-image: url(images/candy.jpg)`);
document.title = `${days} Days ${topic}`;
document.getElementById("quote").innerHTML = 'Coult not load image... sorry :(';

// get random image of topic and show in background
const clientId = '634963dbf1f34470c191e2d1e2929d58afd3d0855be5e00641c8fa8e0d00dd22';
const url = `https://api.unsplash.com/photos/random?client_id=${clientId}&query=${imagesQuery}`;
fetch(url)
	.then(response => response.json())
	.then(json => json.urls.regular)
	.then(picUrl => {
		document.getElementById("bg").setAttribute("style", `background-image: url(${picUrl})`);
	});
	document.getElementById("days").innerHTML = days;
	document.getElementById("subtitle").innerHTML = `Days of living ${topic.toLowerCase()} ${togo}`;
	document.getElementById("quote").innerHTML = quotes[days % quotes.length];

	$(document).ready(function(){
		$('body').jKit();
		var audio = document.getElementById('music');
		// center quote
		if(days === 50) {
			document.getElementById("bg").setAttribute("style", "background-image: url(images/meatHalf.jpg)");
			$("#days").addClass('winningShadowTwo');
			$("#subtitle").addClass('winningShadowTwo');
			$('#madeIt').html("NICE! YOU ARE HALF THROUGH! KEEP GOING!");
			$('.parallax-container').css('top', '-200px');
		}
		if(days === 5) {
			document.getElementById("bg").setAttribute("style", "background-image: url(images/final_soclose.jpg)");
			$('#quote').html(quotes[0]);
		}
		if(days === 4) {
			document.getElementById("bg").setAttribute("style", "background-image: url(images/final_almost.jpg)");
			$('#quote').html(quotes[1]);
		}
		if(days === 3) {
			document.getElementById("bg").setAttribute("style", "background-image: url(images/final_just.png)");
			$('#quote').html(quotes[2]);
			// audio.src = "bacon.mp3";
			// audio.load();
			// audio.play();
		}
		if(days === 2) {
			document.getElementById("bg").setAttribute("style", "background-image: url(images/final_bacon.jpg)");
			$('#quote').html(quotes[3]);
		}
		if(days === 1) {
			document.getElementById("bg").setAttribute("style", "background-image: url(images/meatHalf.jpg)");
			$('#quote').html(quotes[4]);
			// audio.src = "bacon.mp3";
			// audio.load();
			// audio.play();
		}
		if(days === 0) {
			document.getElementById("bg").setAttribute("style", "background-image: url(images/meatMadeIt.jpg)");
			$("#days").addClass('winningShadow');
			$("#subtitle").addClass('winningShadow');
			$('#madeIt').html("Congratulations!");
			$('#quote').html(`You are the Master of the ${topic} Universe`);
			$('.parallax-container').css('top', '300px');
			// audio.src = "epic.mp3";
			// audio.load();
			// audio.play();
		}
	});
