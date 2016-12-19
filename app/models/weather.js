/**
 * Created by edward on 11/1/16.
 */
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var Weather = new Schema({
    name: String,
    weather: String,
    Time: String,
    Date: String,
    location:{
        lat: Number,
        lng: Number
    },
    description: String,
    created_at: {type: Date, default: Date.now}
});

Weather.pre('save', function(next){
    now = new Date();
    if(!this.created_at) {
        this.created_at = now;
    }
    next();
});
module.exports =  mongoose.model('Weathers', Weather);