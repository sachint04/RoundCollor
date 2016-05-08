var directionsDisplay;
var directionsService;
var map;
var curState;
var markers = [];
var infowindow;
var timeInrvl;
var curTime = 0;
var maxTime = 20;
function initMap() {
	console.log('google map init Map.');
	directionsService = new google.maps.DirectionsService();
	directionsDisplay = new google.maps.DirectionsRenderer();
	var delhi = new google.maps.LatLng(28.5941685062326, 77.2119140625);
	map = new google.maps.Map(document.getElementById('map'), {
		center : {
			lat : 0,
			lng : 0
		},
		zoom : 6,
		center : delhi,
		styles : [{
			featureType : 'poi',
			stylers : [{
				visibility : 'off'
			}] // Turn off points of interest.
		}, {
			featureType : 'transit.station',
			stylers : [{
				visibility : 'off'
			}] // Turn off bus stations, train stations, etc.
		}],
		scrollwheel : false,
		fullscreenControl : false,
		mapTypeControl : false,
		mapTypeControlOptions : false,
		disableDoubleClickZoom : true
		// draggable:false
	});

	google.maps.event.addListenerOnce(map, 'idle', function() {

		directionsDisplay.setMap(map);
		addHandlers();
		menuBtnHandlers();

	});

}

function removeHandlers(){
	// google.maps.event.clearListeners(map, 'click');
	// $('#feedback #btnCloseFeedback').off();
	// $("#btnSubmit").off();
	// $("#btnBack").off();
}
function addHandlers() {
	map.addListener('click', mapClickHandler);
	$('#feedback #btnCloseFeedback').click(function(e) {
		$("#feedback").addClass('hide');
	});

	$("#btnSubmit").click(function(e) {
		if (infowindow)
			infowindow.close();
		var marker = createMarker(new google.maps.LatLng(curState.capital.lat, curState.capital.lng), 'green-dot.png');
		marker.addListener('click', function() {
			getAnsWin(curState.capital.name).open(map, marker);
		});
		checkAns(markers[0].position);
	})

	$("#btnBack").click(function() {
		reset();
	});
}

function mapClickHandler(e) {
	var origin;
	var destination = "london";
	//console.log(JSON.stringify(e.latLng));

	if (markers.length > 0) {
		deleteMarkers();
	}
	console.log(e.latLng.toJSON());
	var marker = createMarker(e.latLng, 'red-dot.png', true);
	markers.push(marker);
}

var checkAns = function(latLng) {
	clearTimer();
	var origin = new google.maps.LatLng(curState.capital.lat, curState.capital.lng);
	var dest = latLng;
	var result = calcRoute(origin, dest, function(result, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			var distance = result.routes[0].legs[0].distance.value;
			var text = result.routes[0].legs[0].distance.text;

			var userLat = dest.lat();
			var userLng = dest.lng();
			var path = getPolyLine([{
				lat : curState.capital.lat,
				lng : curState.capital.lng
			}, {
				lat : userLat,
				lng : userLng
			}]);
			path.setMap(map);
			var feedback = "<p> Capital of " + curState.name + " is " + curState.capital.name + ".</p></p>you are " + text + " away from  " + curState.capital.name + ".</p>";

			// directionsDisplay.setDirections(result);
			$("#feedback #content").html(feedback);
			$("#feedback").removeClass('hide').hide().slideDown();
		}
	});
};

function menuBtnHandlers() {
	var cols = 2;
	for (var i = 0; i < data.length; i += 2) {
		var $tr = $('<tr></tr>');
		var elem = [];
		for (var n = 0; n < cols; n++) {
			var state = data[i + n];
			if (state) {
				elem.push('<td><a href="#" id="' + state.id + '"class="statesbtn header2">' + state.name + '</a></td>');
			}
		};
		$tr.append(elem);
		$('#statetbl').append($tr);

	};
	var oScope = this;
	$('.statesbtn').click(function(e) {
		e.preventDefault();
		var id = e.target.id;
		curState = getStateByID(id);
		map.setCenter(new google.maps.LatLng(curState.lat, curState.lng));
		map.setZoom(curState.zoom);
		$('#mapholder').removeClass('tiny');
		$('#area').addClass('hide');
		startTimer();
	});

}

var getStateByID = function(id) {
	var state;
	for (var i = 0; i < data.length; i++) {
		var state = data[i];
		if (state.id === id) {

			break;
		};
	};
	return state;

};

var getAnsWin = function(dest) {
	infowindow = new google.maps.InfoWindow({
		content : '<p>' + dest + '</p>'
	});
	return infowindow;
};

var addMarkerHandler = function(marker) {
	marker.addListener('click', function() {
		getMarkerWin().open(map, marker);
		$("#btnRemoveMarker").click(function(e) {
			deleteMarkers();
		});
		$("#btnSubmitMarker").click(function(e) {
			infowindow.close();
			checkAns(marker.position);
		});
	});
};

var reset = function() { directionsDisplay;directionsService;map;curState;
	markers = []; infowindow = null;timeInrvl = null;curTime = 0;
	removeHandlers();
	deleteMarkers();
	clearTimer();
	if(infowindow)
	infowindow.close();	

	$('#area').removeClass('hide');
	$('#mapholder').addClass('tiny');
}

