$(function() {

	var mapOptions = {
				  center: { lat: cities[5].lat, lng: cities[5].lng},
				  zoom: 5,
				  mapTypeId: "watercolor",
				  mapTypeControlOptions: {
				  	mapTypeIds: ["watercolor"]
				  },
			    panControl: false,
			    mapTypeControl: false,
			    zoomControl: false,
			    streetViewControl: false
				};
	var mapStyle = [
	  {
	    "stylers": [
	      { "visibility": "off" }
	    ]
	  },{
	    "featureType": "water",
	    "elementType": "geometry.fill",
	    "stylers": [
	      { "visibility": "on" }
	    ]
	  }/*,{
	    "featureType": "landscape.natural",
	    "elementType": "geometry.fill",
	    "stylers": [
	      { "visibility": "on" },
	      { "color": "#447b54" }
	    ]
	  }*/
	];

	var UI = {
		$startSplash: $("#startSplash"),
		$startButton: $("#startButton"),
		$question: $("#question").css("left", "100%"),
		$solution: $("#solution").css("left", "100%"),
		$solutionMessage: $(".solution"),
		$questionText: $(".question-keyword"),
		$next: $("#next"),
		$answer1: $("#answer1"),
		$answer2: $("#answer2"),
		$answer1Name: $(".answer1Name"),
		$answer1Country: $(".answer1Country"),
		$answer2Name: $(".answer2Name"),
		$answer2Country: $(".answer2Country"),
		$answer1Text: $("#answer1Text"),
		$answer2Text: $("#answer2Text"),
		$answer1Lat: $(".answer1Lat"),
		$answer2Lat: $(".answer2Lat"),
		$answerJudgement: $(".answer-judgement"),
		$answerMessage: $(".answer-message"),
		$zoomIn: $(".zoom-in"),
		$zoomOut: $(".zoom-out")
	}

	var Question = {};

	var map, 
			markers = [];

	function initialize() {
		map = new google.maps.Map(document.getElementById('map'),
		    mapOptions);
		
		//map.mapTypes.set('mapFeatures', new google.maps.StyledMapType(mapStyle));  
		map.mapTypes.set("watercolor", new google.maps.StamenMapType("watercolor"));
		//map.setMapTypeId('mapFeatures');

	}
	initialize();

	function showCities(list) {
		var bounds = new google.maps.LatLngBounds();
		list.forEach(function(i) {
			var city = cities[i];
			var latlng = new google.maps.LatLng(city.lat, city.lng);
			markers.push(new MarkerWithLabel({
	                position: latlng,
	                map: map,
	                icon: 'images/pin.png',
	                labelContent: 
	                	"<div><span class='city-name'>" + city.name + "</span> \
	                		 <span class='latitude'>Lat: <span class='lat-value'>" + Math.round(city.lat*1000)/1000 + "</span></span></div>",
	                labelClass: "cityLabel"
	            }));
			bounds.extend(latlng);
		});
		map.fitBounds(bounds);
	}

	function slideOut(div) {
		div.animate({left: "-100%"}, 300, "easeInBack");
	}
	function slideIn(div) {
		div.css("left", "100%").animate({left: 0}, 300, "easeInBack");
	}

	function pickAnswer(k) {
		var I = cities[Question.i],
				J = cities[Question.j];

		UI.$answer1Text.text(I.name);
		UI.$answer2Text.text(J.name);
		UI.$answer1Lat.text(Math.round(I.lat*1000)/1000);
		UI.$answer2Lat.text(Math.round(J.lat*1000)/1000);
		var correct = false;
		if (Question.lat) {
			if (I.lat > J.lat) {
				UI.$answerMessage.text(I.name + " is north of " + J.name);
				if (k === 0) correct = true;
			} else {
				UI.$answerMessage.text(I.name + " is south of " + J.name);
				if (k === 1) correct = true;
			}
		} else {
			if (I.lng > J.lng) {
				UI.$answerMessage.text(I.name + " is east of " + J.name);
				if (k === 0) correct = true;
			} else {
				UI.$answerMessage.text(I.name + " is west of " + J.name);
				if (k === 1) correct = true;
			}
		}
		if (correct) {
			UI.$answerJudgement.text("Correct!");
			UI.$solutionMessage.addClass("correct");
		} else {
			UI.$answerJudgement.text("Incorrect!");
			UI.$solutionMessage.removeClass("correct");
		}
		slideOut(UI.$question);
		showCities([Question.i, Question.j]);
		slideIn(UI.$solution);
	}

	function clearOldQuestion() {
		markers.forEach(function(marker) {
			marker.setMap(null);
		});
	}

	function showNewQuestion() {
		slideIn(UI.$question);
		clearOldQuestion();
		var i = Math.floor(Math.random()*cities.length);
		var j = i;
		while (i === j) {
			j = Math.floor(Math.random()*cities.length);
		}
		var I = cities[i],
				J = cities[j];
		var lat = true;//Math.random() < 0.5;
		if (lat) {
			UI.$questionText.text("north");
		} else {
			UI.$questionText.text("west");
		}
		UI.$answer1Name.text(I.name);
		UI.$answer1Country.text(I.country);
		UI.$answer2Name.text(J.name);
		UI.$answer2Country.text(J.country);
		Question = {
			i: i,
			j: j,
			I: I,
			J: J,
			lat: lat
		};
	}

	UI.$startButton.click(function() {
		slideOut(UI.$startSplash);
		showNewQuestion();
	});

	UI.$next.click(function() {
		slideOut(UI.$solution);
		showNewQuestion();
	});

	UI.$answer1.click(function() {
		pickAnswer(0);
	});
	UI.$answer2.click(function() {
		pickAnswer(1);
	});

	UI.$zoomOut.click(function() {
		var zoom = map.getZoom();
		if (zoom > 2) {
			map.setZoom(zoom-1);
		}
	});

	UI.$zoomIn.click(function() {
		var zoom = map.getZoom();
		if (zoom < 16) {
			map.setZoom(zoom+1);
		}
	});

	slideIn(UI.$startSplash);

});