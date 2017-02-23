// server.js

// set up
var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var config = require('./config/config.js');

// configuration
mongoose.connect(config.url); // connect to our database

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback) {
  console.log("Connection succeeded.");
});

require('./config/passport')(passport); // pass passport for configuration

app.configure(function() {

	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms

	app.set('view engine', 'ejs'); // set up ejs for templating

	// required for passport
	app.use(express.session({ secret: config.secret })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session
  app.use(express.static(path.join(__dirname, 'public')));

  app.set('secret', config.secret);

});

// routes
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./app/api.js')(app); // api routes

// launch
app.listen(port);
console.log('Listening on port : ' + port);
