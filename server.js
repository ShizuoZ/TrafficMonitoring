// Created by mahaiyue on 10/07/16.
var express = require("express");
var app = express();
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var database = require("./data/database");
var port = process.env.PORT || 3000;         // set the port

mongoose.Promise = global.Promise;
mongoose.connect(database.url);     // connect to mongoDB database on modulus.io
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));   // parse application/json
app.use(bodyParser.urlencoded({ 
	limit: '50mb',
	extended: 'true',
	parameterLimit:50000
	}));  // parse application/x-www-form-urlencoded
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
//app.use(cookieParser());
app.use(methodOverride());

// routes ===================================.===================================
require('./app/routes.js')(app);
// app.all('/*', function(req, res, next) {
//     // Just send the index.html for other files to support HTML5Mode
//     res.sendFile('index.html', { root: path.join(__dirname, 'public') });
// });

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port : " + port);