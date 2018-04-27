var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: {lat: 41.8779, lng: -87.6300},
    mapTypeId: 'terrain'
  });



  // Create a <script> tag and set the USGS URL as the source.
  var script = document.createElement('script');

  // This example uses a local copy of the GeoJSON stored at
  // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
  script.src = 'Data/query1_latlang.js';
  document.getElementsByTagName('head')[0].appendChild(script);

}

function query1_callback(results) {
  var latLng;
  var p = 0;
  console.log(results[2]);
  for (var i = 0; i < results.length; i++) {
    // p += 1;
    // if (p >= 50){break;}
    var loc = {lat: +results[i]["lat"], lng: +results[i]["lng"]};
    var marker=new google.maps.Marker({
        position:loc,
        clickable:true,
        map:map
      });

      google.maps.event.addListener(marker,'click',function() {
		 	var infowindow = new google.maps.InfoWindow();
		 	var infolist=jQuery('<ul></ul>');
      console.log(results[i]["Business Name"]);
		 	infolist.append(`<li><b>Restaurant</b>: ${results[i]["Business Name"]}</li>`);
      infolist.append(`<li><b>No of total Crimes</b>: ${results[i]["#Crimes"]}</li>`);
      infolist.append(`<li><b>No of total arrests</b>: ${results[i]["#Arrests"]}</li>`);
		 	infowindow.setContent('<div class="infowindow">'+infolist.html()+'</div>');
			infowindow.open(map, marker);
			map.panTo(marker.getPosition());
		 	});
  }
  console.log("finished marking");
}
