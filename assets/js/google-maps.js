if ($("#google-maps").length > 0) {

	/* google map ======================================= */
	$(document).ready(function () {
		function initializeGoogleMap() {
			var myLatlng = new google.maps.LatLng(51.47900, -0.06204);
			var myOptions = {
				center: myLatlng,
				zoom: 16,
				mapTypeControl: false,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				panControl: false,
				zoomControl: false,
				scaleControl: false,
				streetViewControl: false,
				scrollwheel: false
			};

			var styles = [{
				stylers: [{
					hue: "#80B959"
				}, {
					saturation: -20
				}]
			}, {
				featureType: "road",
				elementType: "geometry",
				stylers: [{
					lightness: 100
				}, {
					visibility: "simplified"
				}]
			}];

			var map = new google.maps.Map(document.getElementById("google-maps"), myOptions);
			map.setOptions({
				styles: styles
			});


			var marker = new google.maps.Marker({
				position: myLatlng,
				center: myLatlng
			});


			google.maps.event.addDomListener(window, "resize", function () {
				map.setCenter(myLatlng);
			});

			marker.setMap(map);
		}

		initializeGoogleMap();
	});
}