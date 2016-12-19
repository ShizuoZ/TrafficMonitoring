/**
** Created by mahaiyue on 10/16/16
**/
// Create MongoDB collections model

// Pulls Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Creates a Schema. This will be the basis of how user data is stored in the db
var SearchHistory = new Schema({
    ori:{type: String, required: true}, // [Long, Lat]
    des: {type: String, required: true},
    time: Number,
    created_at: {type: Date, default: Date.now}
});

// Sets the created_at parameter equal to the current time
SearchHistory.pre('save', function(next){
    now = new Date();
    if(!this.created_at) {
        this.created_at = now;
    }
    next();
});



// Indexes this schema in 2dsphere format (critical for running proximity searches)
//SearchHistory.index({location: '2dsphere'});

// Exports the SearchHistory for use elsewhere. Sets the MongoDB collection to be used as: ""
module.exports = mongoose.model('History', SearchHistory);
