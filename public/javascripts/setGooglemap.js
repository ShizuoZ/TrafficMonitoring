var marker;
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.TERRAIN
  });
  //var infoWindow = new google.maps.InfoWindow({map: map});

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // infoWindow.setPosition(pos);
      // infoWindow.setContent('Location found.');
      map.setCenter(pos);
    }, 
      handleLocationError);
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
    marker = new google.maps.Marker({
      map: map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      position: pos
      });
      marker.addListener('click', toggleBounce);
}

function handleLocationError(err) {
  switch(err.code){
          case err.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
          case err.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
          case err.TIMEOUT:
            alert("Request timed out.");
            break;
          case err.UNKNOWN_ERROR:
            alert("Unknown error.");
            break;
          default:
            break;
        }
}

function toggleBounce() {
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } 
            else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
            }
}