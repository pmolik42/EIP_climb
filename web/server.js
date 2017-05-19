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

// set accept headers
app.use(function(req, res, next) {
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);


  // Allow any request headers
  res.header("Access-Control-Allow-Origin", "*");

  // Allow any request headers
  if (req.get("Access-Control-Request-Headers")){
       res.setHeader('Access-Control-Allow-Headers', req.get("Access-Control-Request-Headers"));
    }

  // Request methods you wish to allow (all here)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Pass to next layer of middleware
  next();
});


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
    console.log('Database with Basic Users, Articles and Videos');
  }
});

// launch
app.listen(port);
console.log('Listening on port : ' + port);
