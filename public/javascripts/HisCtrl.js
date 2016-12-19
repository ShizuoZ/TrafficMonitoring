/**
 * Created by mahaiyue on 10/21/16.
 */
var hisCtrl = angular.module('HisCtrl', []);
hisCtrl.controller('HisCtrl', function($scope, $http){
    // when landing on the page, get all searching histories and show them

var refresh = function() {    
    $http.get('/api/historys')
        .success(function(data) {
            $scope.historys = data;
            var a = [0,0,0,0,0,0];
            for(var i = 0; i < data.length; i++){
                var num = data[i].time;
                if(num>=1&&num<5)
                    a[0]++;
                if(num>=5&&num<9)
                    a[1]++;
                if(num>=9&&num<13)
                    a[2]++;
                if(num>=13&&num<17)
                    a[3]++;
                if(num>=17&&num<21)
                    a[4]++;
                if(num>=21)
                    a[5]++;
            }
            $scope.chartdata = a;
            //console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
}
refresh();
    // delete a history
    $scope.deleteHistory = function(id) {
        $http.delete('/api/historys/' + id)
            .success(function(data) {
                $scope.historys = data;
                //console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        refresh();
    };
    $scope.labels = ['0:00-4:00', '4:00-8:00', '8:00-12:00', '12:00-16:00', '16:00-20:00', '20:00-24:00'];

    $scope.sortColumn = 'date';
    $scope.reverseSort = false;
    $scope.sortData = function (column) {
        $scope.reverseSort = ($scope.sortColumn == column) ? !$scope.reverseSort : false;
        $scope.sortColumn = column;
    }
    

    $("#ori_button1").click(function(){
        if($("#ori_button").hasClass("glyphicon glyphicon-triangle-bottom"))
        $("#ori_button").removeClass("glyphicon glyphicon-triangle-bottom").addClass("glyphicon glyphicon-triangle-top");
        else
        $("#ori_button").removeClass("glyphicon glyphicon-triangle-top").addClass("glyphicon glyphicon-triangle-bottom");
    });
    $("#des_button1").click(function(){
        if($("#des_button").hasClass("glyphicon glyphicon-triangle-bottom"))
        $("#des_button").removeClass("glyphicon glyphicon-triangle-bottom").addClass("glyphicon glyphicon-triangle-top");
        else
        $("#des_button").removeClass("glyphicon glyphicon-triangle-top").addClass("glyphicon glyphicon-triangle-bottom");
    });
    $("#time_button1").click(function(){
        if($("#time_button").hasClass("glyphicon glyphicon-triangle-bottom"))
        $("#time_button").removeClass("glyphicon glyphicon-triangle-bottom").addClass("glyphicon glyphicon-triangle-top");
        else
        $("#time_button").removeClass("glyphicon glyphicon-triangle-top").addClass("glyphicon glyphicon-triangle-bottom");
    });
    $("#date_button1").click(function(){
        if($("#date_button").hasClass("glyphicon glyphicon-triangle-bottom"))
        $("#date_button").removeClass("glyphicon glyphicon-triangle-bottom").addClass("glyphicon glyphicon-triangle-top");
        else
        $("#date_button").removeClass("glyphicon glyphicon-triangle-top").addClass("glyphicon glyphicon-triangle-bottom");
    });
});



























