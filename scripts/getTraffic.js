/**
 * Created by edward on 10/31/16.
 */
var http = require("http");
var mongoose = require("mongoose");
var database = require("../data/database");
var Incidents = require("../app/models/incidents");
mongoose.connect(database.url);
function run() {
    var url = "http://www.mapquestapi.com/traffic/v2/incidents?key=wkilOhM298GvH1ENiJhLdHOVwmb2tjgX&callback=handleIncidentsResponse&boundingBox=40.704739,-74.717459,40.287012,-74.168143&filters=construction,incidents,event,congestion&inFormat=kvp&outFormat=j"
// get is a simple wrapper for request()
// which sets the http method to GET
    var request = http.get(url, function (response) {
        // data is streamed in chunks from the server
        // so we have to handle the "data" event
        var buffer = "",
            data,
            incidents = [];
        Incidents.schema.pre('save', function (next, done) {
            var self = this;
            Incidents.find({id: self.id}, function (err, docs) {
                if (!err && !docs.length) {
                    console.log('new incident! ', self.id);
                    next();
                }
                else {
                    // console.log('incident existed!');
                    next(new Error("existed"));
                }
            })
        });
        response.on("data", function (chunk) {
            buffer += chunk;
        });

        response.on("end", function (err) {
            // finished transferring data
            // dump the raw data
            // console.log(buffer);
            // console.log("\n");
            data = JSON.parse(buffer);
            var raw_incidents = data.incidents;
            var type_String = {
                1: "Construction",
                2: "Event",
                3: "Congestion/Flow",
                4: "Incident/Accident"
            };
            for (var i = 0; i < raw_incidents.length; i++) {
                var newincident = new Incidents({
                    "id": raw_incidents[i].id,
                    "location": {
                        "lat": raw_incidents[i].lat,
                        "lng": raw_incidents[i].lng
                    },
                    "type": type_String[raw_incidents[i].type],
                    "severity": raw_incidents[i].severity,
                    "startTime": raw_incidents[i].startTime,
                    "endTime": raw_incidents[i].endTime,
                    "roadName": raw_incidents[i].parameterizedDescription.roadName,
                    "fromLocation": raw_incidents[i].parameterizedDescription.fromLocation,
                    "toLocation": raw_incidents[i].parameterizedDescription.toLocation,
                    "description": raw_incidents[i].shortDesc,
                    "delayFromTypical": raw_incidents[i].delayFromTypical
                });
                newincident.save(function (err) {
                    if (err) {
                        return;
                        // return console.log("error reported");
                    }
                    else console.log("inserted id: ", newincident.id);
                    // console.dir(newincident);
                });

                // Incidents.findOne({id: newincident.id},function(err,res){
                //     if(!err){}
                //     if(!res && !res.length){
                //         console.log("incident exists: ", res.id);
                //     }else {
                //         newincident.save(function(err2,res){
                //             if(err2)
                //                 console.error(err);
                //             //
                //             console.dir(newincident);
                //         });
                //         console.log("new incident");
                //     }
                // });
                // newincident.save(function(err, newincident){
                //     if(err)
                //         return console.error(err);
                //
                //     console.dir(newincident);
                // });
                incidents.push(newincident);
                // console.log(newincident);
            }
            console.log("check all");
        });
    });
    // mongoose.connection.close();
    setTimeout(run,120000);
};
run();
