function myMap() {
			var contentString = '';
			infoWindow = new google.maps.InfoWindow({
				size: new google.maps.Size(100,30),
			});
			var geocoder = new google.maps.Geocoder()
			var mapProp= {
				center:new google.maps.LatLng(20.5937,78.9629),
				zoom:5,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			var directionsService = new google.maps.DirectionsService;
        	var directionsDisplay = new google.maps.DirectionsRenderer;        	
			var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
			directionsDisplay.setMap(map);
			var submit = document.getElementById('submit');
			submit.addEventListener('click', function(){
				calculateAndDisplayRoute(directionsService, directionsDisplay);
			});
		}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        var waypts = [];
        var checkboxArray = document.getElementById('pass_through_select');
        for (var i = 0; i < checkboxArray.length; i++) {
          if (checkboxArray.options[i].selected) {
            waypts.push({
              location: checkboxArray[i].value,
              stopover: true
            });
          }
        }

        directionsService.route({
          origin: document.getElementById('start_select').value,
          destination: document.getElementById('end_point_select').value,
          waypoints: waypts,
          optimizeWaypoints: true,
          travelMode: 'DRIVING'
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
            var route = response.routes[0];
            var summaryPanel = document.getElementById('direction_panel');
            summaryPanel.innerHTML = '';
            // For each route, display summary information.
            for (var i = 0; i < route.legs.length; i++) {
              var routeSegment = i + 1;
              summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
                  '</b><br>';
              summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
              summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
              summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
            }
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }