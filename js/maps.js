var map;
var markerlist = [];
var heatmaplist = [];
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: 41.8863, lng: -87.7173},
    mapTypeId: 'terrain'
  });



  // Create a <script> tag and set the USGS URL as the source.
  var script = document.createElement('script');

  // This example uses a local copy of the GeoJSON stored at
  // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
  script.src = 'Data/query_9.js';
  document.getElementsByTagName('head')[0].appendChild(script);

  google.maps.event.addListener(map, 'zoom_changed', function() {
  var zoom = map.getZoom();
  console.log(zoom);
  if (zoom >= 13) {
    markerlist.forEach(function(item) {
      item.setMap(map)
    });
    console.log("markers added");
    heatmaplist.forEach(function(item) {
      item.setMap(null)
    });
    console.log("heatmap removed");
  }
  else {
    markerlist.forEach(function(item) {
      item.setMap(null)
    });
    console.log("markers removed");
    heatmaplist.forEach(function(item) {
      item.setMap(map)
    });
    console.log("heatmap added");
  }
})
}

function eqfeed_callback(results) {
  var heatmapData = [];
  var latLng;
  for (var i = 0; i < results.length; i++) {
    latLng = new google.maps.LatLng(results[i].lattitude, results[i].longitude);
    var magnitude = results[i]["No of total Crimes"];
    var weightedLoc = {
      location: latLng,
      weight: magnitude/75
    };
    heatmapData.push(weightedLoc);
  }

  results.forEach(function(row) {
 			var marker=new google.maps.Marker({
        position:{lat:row.lattitude, lng:row.longitude},
        clickable:true,
        map:map,
        animation:google.maps.Animation.DROP
      });

      markerlist.push(marker);

 			google.maps.event.addListener(marker,'click',function() {
		 	var infowindow = new google.maps.InfoWindow();
		 	var infolist=jQuery('<ul></ul>');
		 	infolist.append(`<li><b>No of restaurants with liquor sold</b>: ${row["No of restaurants with liquor sold"]}</li>`);
      infolist.append(`<li><b>No of total Crimes</b>: ${row["No of total Crimes"]}</li>`);
      infolist.append(`<li><b>No of total arrests</b>: ${row["No of total arrests"]}</li>`);
		 	infowindow.setContent('<div class="infowindow">'+infolist.html()+'</div>');
			infowindow.open(map, marker);
			map.panTo(marker.getPosition());
		 	});
 		});

  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapData,
    dissipating: true,
    radius: 50,
    map: map
  });
    heatmaplist.push(heatmap);
}
