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
			var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
			var submit = document.getElementById('submit');
			submit.addEventListener('click', function(){
				alert("piyush");
			});
		}
