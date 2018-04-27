var map;
var markersArray = []

var year_select = document.getElementById('Yearselect');
var crime_select = document.getElementById('Crimeselect');
var go = document.getElementById('go');
go.addEventListener('click', function() {
  console.log(crime_select.value);
  console.log(year_select.value);
  clearOverlays();
  // Create a <script> tag and set the USGS URL as the source.
  var script = document.createElement('script');

  // This example uses a local copy of the GeoJSON stored at
  // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
  script.src = 'Data/query1_latlang.js';
  document.getElementsByTagName('head')[0].appendChild(script);
}, false);

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: {lat: 41.8779, lng: -87.6300},
    mapTypeId: 'terrain'
  });
}

function clearOverlays() {
  for (var i = 0; i < markersArray.length; i++ ) {
    markersArray[i].setMap(null);
  }
  markersArray.length = 0;
}

function query1_callback(results) {
  var latLng;
  console.log(results[2]);
  var val_y = year_select.value;
  var val_c = crime_select.value;


  results.forEach(function(row) {
    if((row["Year"] == val_y || val_y == "n") && (row["Crime Type"] == val_c || val_c == "n")){
      var loc = {lat: +row["lat"], lng: +row["lng"]};
      var marker=new google.maps.Marker({
          position:loc,
          clickable:true,
          map:map
        });
      markersArray.push(marker);

        marker.addListener('click',function() {
  		 	var infowindow = new google.maps.InfoWindow();
  		 	var infolist=jQuery('<ul></ul>');
        console.log(row);
  		 	infolist.append(`<li><b>Restaurant</b>: ${row["Business Name"]}</li>`);
        infolist.append(`<li><b>Crime type</b>: ${row["Crime Type"]}</li>`);
        infolist.append(`<li><b>No of total Crimes</b>: ${row["#Crimes"]}</li>`);
        infolist.append(`<li><b>No of total arrests</b>: ${row["#Arrests"]}</li>`);
        infolist.append(`<li><b>No of total crimes on premises</b>: ${row["#On Premises"]}</li>`);
        infolist.append(`<li><b>Has Liquor License</b>: ${row["Has Liquor License"]}</li>`);
        infolist.append(`<li><b>Has Tobacco License</b>: ${row["Has Tobacco License"]}</li>`);
  		 	infowindow.setContent('<div class="infowindow">'+infolist.html()+'</div>');
  			infowindow.open(map, marker);
  			map.panTo(marker.getPosition());
  		 	});
    }
  });
  console.log("finished marking");
}
