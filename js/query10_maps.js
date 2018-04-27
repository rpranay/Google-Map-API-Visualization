var map;
var markersArray = []
var heatmaplist = []

var year_select = document.getElementById('Yearselect');
var crime_select = document.getElementById('Crimeselect');
var month_select = document.getElementById('Monthselect');
var go = document.getElementById('go');
go.addEventListener('click', function() {
  console.log(crime_select.value);
  console.log(year_select.value);
  clearOverlays();

  var script = document.createElement('script');
  script.src = 'Data/query_10.js';
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
  for (var i = 0; i < heatmaplist.length; i++ ) {
    heatmaplist[i].setMap(null);
  }
  heatmaplist.length = 0;
}

function query10_callback(results) {
  var latLng;
  console.log(results[2]);
  var val_y = year_select.value;
  var val_c = crime_select.value;
  var val_m = month_select.value;

  results.forEach(function(row) {
    var heatmapData = []
    if((row["Year"] == val_y) && (row["month"] == val_m) && (row["Primary Type"] == val_c || val_c == "n"))
    {
      console.log(row["lattitude"]);
      var loc = {lat: +row["lattitude"], lng: +row["longitude"]};
      latLng = new google.maps.LatLng(+row["lattitude"], +row["longitude"]);
      var magnitude = row["MeanTemperature"];
      var weightedLoc = {
        location: latLng,
        weight: magnitude/5
      };
      heatmapData.push(weightedLoc);

      var heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        dissipating: true,
        radius: 50,
        map: map
      });
      heatmaplist.push(heatmap);

      // var marker=new google.maps.Marker({
      //     position:loc,
      //     clickable:true,
      //     map:map
      //   });
      // markersArray.push(marker);

        // marker.addListener('click',function() {
  		 	// var infowindow = new google.maps.InfoWindow();
  		 	// var infolist=jQuery('<ul></ul>');
        // console.log(row);
  		 	// infolist.append(`<li><b>Restaurant</b>: ${row["Business Name"]}</li>`);
        // infolist.append(`<li><b>Crime type</b>: ${row["Crime Type"]}</li>`);
        // infolist.append(`<li><b>No of total Crimes</b>: ${row["#Crimes"]}</li>`);
        // infolist.append(`<li><b>No of total arrests</b>: ${row["#Arrests"]}</li>`);
        // infolist.append(`<li><b>No of total crimes on premises</b>: ${row["#On Premises"]}</li>`);
        // infolist.append(`<li><b>Has Liquor License</b>: ${row["Has Liquor License"]}</li>`);
        // infolist.append(`<li><b>Has Tobacco License</b>: ${row["Has Tobacco License"]}</li>`);
  		 	// infowindow.setContent('<div class="infowindow">'+infolist.html()+'</div>');
  			// infowindow.open(map, marker);
  			// map.panTo(marker.getPosition());
  		 	// });
    }
  });
  console.log("finished marking");
}
