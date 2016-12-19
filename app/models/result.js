/**
** Created by mahaiyue on 11/21/16
**/

// Pulls Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Creates a Schema. This will be the basis of how user data is stored in the db
var Result = new Schema({
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
    created_at: Date
});

module.exports = mongoose.model('Results', Result);
