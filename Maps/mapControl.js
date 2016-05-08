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
function calcRoute(start, end, next) {
 
  var request = {
    origin:start,
    destination:end,
    travelMode: google.maps.TravelMode.DRIVING
  };
  
  directionsService.route(request, next);
}

var getPolyLine = function(path){
	return new google.maps.Polyline({
    path: path,
    geodesic: true,
    strokeColor: '#0000FF',
    strokeOpacity: 1.0,
    strokeWeight: 2
 });
}
function createMarker(myLatLng, icon_name, b_addHandler){
	//var pinImage = new google.maps.MarkerImage("http://www.googlemapsmarkers.com/v1/009900/")
	var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    icon:'http://maps.google.com/mapfiles/ms/icons/'+icon_name,
    // icon: {
			// path: icon_name,
			// fillColor: '#00CCBB',
			// fillOpacity: 1,
			// strokeColor: '',
			// strokeWeight: 0
		// },

     animation: google.maps.Animation.DROP
  });
  
  if(b_addHandler)
  addMarkerHandler(marker);
  
  return marker;
}