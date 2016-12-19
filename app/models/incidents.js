/**
 * Created by edward on 10/30/16.
 */
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
// Creates a Schema. This will be the basis of how user data is stored in the db
var TrafficIncidents = new Schema({
    id : Number,
    location:{
        lat: Number,
        lng: Number
    },
    type: String,
    severity: Number,
    startTime: String,
    endTime: String,
    roadName : String,
    fromLocation : String,
    toLocation : String,
    description : String,
    delayFromTypical : Number,
    created_at: {type: Date, default: Date.now}
});

TrafficIncidents.pre('save', function(next){
    now = new Date();
    if(!this.created_at) {
        this.created_at = now;
    }
    next();
});
module.exports =  mongoose.model('Incidents', TrafficIncidents);