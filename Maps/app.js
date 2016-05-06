var directionsDisplay;
var directionsService;
var map;
var curState;
var markers = [];
var infowindow;
function initMap() {
	console.log('google map init Map.');
	directionsService = new google.maps.DirectionsService();
	directionsDisplay = new google.maps.DirectionsRenderer();
	var delhi= new google.maps.LatLng(28.5941685062326,77.2119140625);
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0, lng: 0},
    zoom: 6,
    center:delhi,
    styles: [{
      featureType: 'poi',
      stylers: [{ visibility: 'off' }]  // Turn off points of interest.
    }, 
    {
       featureType: 'transit.station',
       stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
     }
    ],
    scrollwheel:false,
    fullscreenControl:false,
    mapTypeControl:false,
    mapTypeControlOptions:false,
    disableDoubleClickZoom: true,
    draggable:false
  });
  
  	google.maps.event.addListenerOnce(map, 'idle', function(){
  		
	  directionsDisplay.setMap(map);
	   addHandlers();
	 menuBtnHandlers();
	
	});

}


function createMarker(myLatLng){
	//var pinImage = new google.maps.MarkerImage("http://www.googlemapsmarkers.com/v1/009900/")
	var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
     animation: google.maps.Animation.DROP
  });
  addMarkerHandler(marker);
  return marker;
}
function addHandlers(){
	map.addListener('click', mapClickHandler);
	$('#feedback #btnCloseFeedback').click(function(e){
		$("#feedback").addClass('hide');
	});
}

function mapClickHandler(e){
	var origin;
	var destination = "london";
	var marker = createMarker(e.LatLng);
 	//console.log(JSON.stringify(e.latLng));
 	
 	if(markers.length> 0){
 		deleteMarkers();
 	}
  	markers.push(createMarker(e.latLng));
  	// var result = calcRoute(origin, dest, function(result, status) {
    // if (status == google.maps.DirectionsStatus.OK) {
      // var distance = result.routes[0].legs[0].distance.value;
      // console.log('distance - '+ distance);
     // // directionsDisplay.setDirections(result);
//        
    // }
  // });
 
}

var checkAns = function(latLng){
	var origin 	=	new google.maps.LatLng(curState.capital.lat, curState.capital.lng);
 	var dest 	= 	latLng;
	var result = calcRoute(origin, dest, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      var distance = result.routes[0].legs[0].distance.value;
      var text = result.routes[0].legs[0].distance.text;
      console.log('distance - '+ distance);
      
     var feedback = "<p> Capital of "+curState.name+" is "+curState.capital.name+".</p></p>you are " +text+ " away from  "+curState.capital.name+".</p>";
     directionsDisplay.setDirections(result);
      $("#feedback #content").html(feedback);
       $("#feedback").removeClass('hide');
    }
  });
};

function calcRoute(start, end, next) {
 
  var request = {
    origin:start,
    destination:end,
    travelMode: google.maps.TravelMode.DRIVING
  };
  
  directionsService.route(request, next);
}


function menuBtnHandlers(){
	var cols = 2;
	for (var i=0; i < data.length; i += 2) {
		 var $tr = $('<tr></tr>');
		 var elem 		= [];
		for (var n=0; n < cols; n++) {
		  var state = data[i + n];
		  if(state){
			  elem.push('<td><a href="#" id="'+state.id+'"class="statesbtn header2">'+state.name+'</a></td>');
		  }
		};
		$tr.append(elem);	  
		$('#statetbl').append($tr);
		
	};
	
	$('.statesbtn').click(function(e){
		var id = e.target.id;
		curState = getStateByID(id);
		map.setCenter(new google.maps.LatLng(curState.lat,curState.lng));
	 	$('#mapholder').removeClass('tiny');
	  	$('#area').addClass('hide');
		
	});
	
}

var getStateByID = function(id){
	var state;
		for (var i=0; i < data.length; i++) {
		  var state = data[i];
		  if(state.id === id){
		  
		  	break;
		  };
		};
	return state;
	
};
var deleteMarkers =	function() {
  clearMarkers();
  markers = [];
};
var clearMarkers = function() {
  setMapOnAll(null);
};
var setMapOnAll  = function(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
};

var getMarkerWin = function(){
	infowindow = new google.maps.InfoWindow({
    content: '<button id="btnRemoveMarker">Remove</button><button id="btnSubmitMarker">Submit</button>'
  });
  return infowindow;
};

var addMarkerHandler = function(marker){
	marker.addListener('click', function() {
    getMarkerWin().open(map, marker);
    $("#btnRemoveMarker").click(function(e){
    	deleteMarkers();
    });
    $("#btnSubmitMarker").click(function(e){
    	infowindow.close();
    	checkAns(marker.position);
    });
  });
};

