// server.js

// set up
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 8080;
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const config = require('./config/config.js');

//import { PassportLocal } from './config/passport';

// configuration
mongoose.connect(config.database.url); // connect to our database

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", (callback) => {
  console.log("Connection succeeded.");
});

//PassportLocal(passport);

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use(session({ secret: config.secret })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(express.static(path.join(__dirname, 'public')));

app.set('secret', config.secret);

// routes
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./app/api.js')(app); // api routes

// Populate Database
require('./test/create_sample_data.js')((err, data) => {
  if (err) return console.log(err);
  if (data) {
    console.log('Articles in database');
  }
});

// launch
app.listen(port);
console.log('Listening on port : ' + port);
