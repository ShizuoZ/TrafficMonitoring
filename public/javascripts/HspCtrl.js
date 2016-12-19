/**
 * Created by mahaiyue on 10/22/16.
 */
var hotCtrl = angular.module('HspCtrl', ['uiGmapgoogle-maps', 'chart.js']);

hotCtrl.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
      tooltipFillColor: '#EEE',
      tooltipFontColor: '#000',
      tooltipFontSize: 12,
      tooltipCornerRadius: 3,
      responsive: true
    });
  }]);

hotCtrl.controller('HspCtrl', function($scope, $http, $log, uiGmapGoogleMapApi, uiGmapIsReady) {
    // Do stuff with your $scope.
    // Note: Some of the directives require at least something to be defined originally!
    // e.g. $scope.markers = []
    $scope.formData = {
        "day": "All",
        "weather": "All",
        "severity": "All"
    };
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
            $scope.chartdata1.push(results);
        })
        .error(function(data){
            console.log('Error' + data);
        });
    $scope.labels2 = ['0: 00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', 
    '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
    $scope.chartdata2 = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

    $scope.labels3 = ['1', '2', '3', '4', '5'];
    $scope.chartdata3 = [0, 0, 0, 0, 0];
    $scope.labels4 = ['Haze','Clouds','Rain','Clear'];
    $scope.chartdata4 = [0, 0, 0, 0];    

/*-------------------------------------------------------------------------------------------------------*/
/*                                          Draw map                                                     */
/*-------------------------------------------------------------------------------------------------------*/
    dataPoints=[new google.maps.LatLng(40.523325, -74.458809)];
    //dataPoints=[];
    $scope.map = {
        center: {
            latitude: 40.523325,
            longitude: -74.458809
        },
        control : {},
        markClick: false,
        zoom: 8,
        fit: true,
        pan: 1,
        events: {
            click: function(mapModel, eventName, originalEventArgs) {
                var e = originalEventArgs[0];
                var city;
                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            var arrAddress = results[1].formatted_address;
                            var  value=arrAddress.split(",");
                            var count=value.length;
                            city=value[count-3];
                            $scope.$apply(function() { 
                                $scope.place = city;
                            });
                            $http.get('/api/incidents')
                            .success(function(data){  
                                var results = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
                                var level = [0,0,0,0,0];

                                for(var i = 0; i < data.length; i++){
                                  var obj = data[i].created_at;
                                  var date = new Date(obj);
                                  var num = parseInt(date.getHours());
                                  var location_name = data[i].toLocation;
                                  
                                  if(location_name===city){
                                    results[0][num]++;
                                    var num = data[i].severity;
                                    level[num]++;
                                    }  
                                } 
                                $scope.chartdata2=results;
                                $scope.chartdata3=level;
                            })
                            .error(function(data){
                                console.log('Error' + data);
                            });
                            $http.get('/api/weathers')
                            .success(function(data){  
                                var condition = [0,0,0,0];
                                for(var i = 0; i < data.length; i++){
                                    if(data[i].name===city){
                                        var weather_condition = data[i].weather;
                                        if(weather_condition==="Haze")
                                            condition[0]++;
                                        if(weather_condition==="Clouds")
                                            condition[1]++;
                                        if(weather_condition==="Rain")
                                            condition[2]++;
                                        if(weather_condition==="Clear")
                                            condition[3]++;
                                    }
                                }
                                console.log(condition);
                                $scope.chartdata4=condition;
                            })
                            .error(function(data){
                                console.log('Error' + data);
                            });
                        } else {
                            console.log('Location not found');
                        }
                    }
                });
            }
        }   
    };
    uiGmapIsReady.promise(1)                     // this gets all (ready) map instances - defaults to 1 for the first map
        .then(function(instances) {
            instances.forEach(function(inst) {   // instances is an array object
                $scope.maps = inst.map;
                $scope.heatmap = new google.maps.visualization.HeatmapLayer({
                data: dataPoints,
                map: inst.map
                });
                $scope.heatmap.set('radius',5);
                $scope.heatmap.set('opacity', 0.7);
            });
    });
    
    //$scope.Markers = [];
    $scope.Markers = [];
/*-------------------------------------------------------------------------------------------------------*/
/*                                          Form Controller                                              */
/*-------------------------------------------------------------------------------------------------------*/
    $scope.update = function() {
        // get all incidents according to form data
        $http.post('/api/hotspots', $scope.formData)
            .success(function (data) {
                let markers = [];
                for(let i = 0; i < data.length; i++){
                    let newmarker = {};
                    newmarker.latitude = data[i].location.lat;
                    newmarker.longitude = data[i].location.lng;
                    newmarker.place = data[i].toLocation;
                    newmarker.id = i;
                    markers.push(newmarker);
                }      
                $scope.Markers = markers;

                // after we obtain the incidents according to Weather, Day and Severity,
                // send back the results to Results database
                $http.post('/api/results', data)
                    .success(function(dt){
                        console.log("Send incidents data back to Results database");
                    })
                    .error(function(err){
                        console.log('Error: ' + err);
                    });
                // update traffic pattern chart for all locations
                $http.get('/api/results')
                .success(function(data){
                    //console.log("i'm changing traffic pattern for all area");
                    var a = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                    for(var i = 0; i < data.length; i++){
                        var num = new Date(Date.parse(data[i].created_at)).getHours();
                        a[num]++;
                    }
                    $scope.chartdata1 = [];
                    $scope.chartdata1.push(a);
                })
                .error(function(err){
                    console.log('Error: ' + err);
                })
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

            $scope.events = {
                    click: function(marker, eventName, model){
                        // eventName is the name of event, e.g.: "click"
                        // model is the marker that we click, it contain the key we save before
                        // marker is google map marker object, we can define the attr, like "marker.showWindow=true"
                        console.log(model.place);
                        $scope.place = model.place;
                        var clickedmark = {};
                        clickedmark.place = model.place;
                        $http.post('/api/incidents', clickedmark)
                            .success(function(data){
                                $scope.chartdata2 = [];
                                $scope.chartdata2.push(data);
                            })
                            .error(function(data){
                                console.log('Error: ' + data);
                            });
                    }
            };
            $http.get('/api/incidents')
            .success(function(data){  
                for(var i = 0; i < data.length; i++){
                    dataPoints.push(new google.maps.LatLng(data[i].location.lat, data[i].location.lng));    
                }
                $scope.heatmap = new google.maps.visualization.HeatmapLayer({
                data: dataPoints,
                map: $scope.maps
                });
                console.log(dataPoints.length);
            })
            .error(function(data){
                console.log('Error' + data);
            });
            
            


    };

    $scope.reset = function() {
        $scope.formData = {};
    }
});
