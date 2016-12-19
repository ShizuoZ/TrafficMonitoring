/**
 * Created by edward on 10/21/16.
 * Edit-contributer mahaiyue.
 */
var mainCtrl = angular.module('MainCtrl', ['uiGmapgoogle-maps', 'chart.js']);

mainCtrl.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
      tooltipFillColor: '#EEE',
      tooltipFontColor: '#000',
      tooltipFontSize: 12,
      tooltipCornerRadius: 3,
      responsive: true
    });
  }]);

mainCtrl.controller('MainCtrl', function($scope, $http, $log, uiGmapGoogleMapApi, uiGmapIsReady) {
    // Do stuff with your $scope.
    // Note: Some of the directives require at least something to be defined originally!
    // e.g. $scope.markers = []
    $scope.setPanel = function (renderer) {
    renderer.setPanel(document.getElementById('panelId'));
    }
    $scope.formData = {};

/*-------------------------------------------------------------------------------------------------------*/
/*                                          Draw chart                                                   */
/*-------------------------------------------------------------------------------------------------------*/
    // After obtaining traffic data from db, draw 2 line charts
    $scope.labels1 = ['0: 00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', 
    '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
    $scope.chartdata1 = [];
    $http.get('/api/incidents')
        .success(function(data){  
            var results = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            for(var i = 0; i < data.length; i++){
              var obj = data[i].created_at;
              var date = new Date(obj);
              var num = parseInt(date.getHours());
              results[num]++;
            }
            console.log(results);
            $scope.chartdata1.push(results);
        })
        .error(function(data){
            console.log('Error' + data);
        });
    $scope.labels2 = ['0: 00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', 
    '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
    $scope.chartdata2 = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
/*-------------------------------------------------------------------------------------------------------*/
/*                                          Draw map                                                     */
/*-------------------------------------------------------------------------------------------------------*/
 function refresh(){
    $scope.map = {
        center: {
            latitude: 40.523325,
            longitude: -74.458809
        },
        markClick: false,
        zoom: 13,
        fit: true,
        pan: 1,
    };
    $scope.marker = {
        id: 0,
        coords: {
            latitude: 40.523325,
            longitude: -74.458809
        },
        options: {
            draggable: true
        },
        events: {
            dragend: function (marker, eventName, args) {
                var lat = marker.getPosition().lat();
                var lon = marker.getPosition().lng();
                //console.log(lat);
                //console.log(lon);
                $scope.marker.options = {
                    draggable: true,
                    labelContent: "",
                    labelAnchor: "100 0",
                    labelClass: "marker-labels"
                };
            }
        }
    };

    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi
        .then(function(maps) {
            $scope.directionsService = new maps.DirectionsService();
            $scope.directionsDisplay = new google.maps.DirectionsRenderer();
            $scope.geocoder = new google.maps.Geocoder();
        });

    uiGmapIsReady.promise(1)                     // this gets all (ready) map instances - defaults to 1 for the first map
        .then(function(instances) {
            instances.forEach(function(inst) {   // instances is an array object
                $scope.maps = inst.map;
                $scope.directionsDisplay.setMap(inst.maps); // if only 1 map it's found at index 0 of array
                $scope.directionsDisplay.setPanel(document.getElementById('right-panel'));
            });
    });
}
refresh();
/*-------------------------------------------------------------------------------------------------------*/
/*                                          Form Controller                                              */
/*-------------------------------------------------------------------------------------------------------*/
    $scope.update = function() {
        refresh();
        // console.log($scope.ori_detail.name);
        // console.log($scope.des_detail.name);
        var request = {
            origin: $scope.ori_detail.geometry.location,
            destination: $scope.des_detail.geometry.location,
            travelMode: google.maps.TravelMode.DRIVING,
            optimizeWaypoints: true
        }
        $scope.directionsDisplay.setMap($scope.maps);
        $scope.directionsService.route(request, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                
            $scope.directionsDisplay.setDirections(response);
            }
        });

        //$scope.directions = googleDirections.getDirections(request).then(function(directions) {
        //    console.log(directions);
        //    return directions;
        //});

        $scope.marker = {};

        // Saves the user data to the db
        $http.post('/api/historys', $scope.formData)
            .success(function (data) {
                // Once complete, clear the form (except location)
                $scope.formData = {};

            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

    };

    $scope.reset = function() {
        $scope.formData = {};
    }
});
/*-------------------------------------------------------------------------------------------------------*/
/*                                          Address Autocomplete                                         */
/*-------------------------------------------------------------------------------------------------------*/
mainCtrl.directive('googleplace',function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {}
            };
            switch(element[0].id){
                case "origin":
                    scope.gPlace = new google.maps.places.Autocomplete(element[0], options);
                    google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
                        scope.$apply(function () {
                            scope.ori_detail = scope.gPlace.getPlace();
                            model.$setViewValue(element.val());
                        });
                    });
                    break;
                case "destination":
                    scope.gPlace2 = new google.maps.places.Autocomplete(element[0], options);
                    google.maps.event.addListener(scope.gPlace2, 'place_changed', function () {
                        scope.$apply(function () {
                            scope.des_detail = scope.gPlace2.getPlace();
                            model.$setViewValue(element.val());
                        });
                    });
                    break;
            }
        }
    };
});