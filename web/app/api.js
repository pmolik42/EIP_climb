var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config/config.js');

var User = require('./models/user.js');
var signup = require('./modules/auth/signup.js');

// app/routes.js
module.exports = function(app) {

	// process the login form
	app.post('/api/authenticate', function(req, res) {
    // find the user
    User.findOne( { $or: [ { 'local.email': req.body.email }, { 'profile.username': req.body.email } ] }, function(err, user) {

      if (err)
        throw err;

      if (!user) {
        res.json( { success: false, message: 'Authentication failed. User not found.' } );
      } else if (user) {

        // check if password matches
        if (!user.validPassword(req.body.password)) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {

          // if user is found and password is right
          // create a token
          var token = jwt.sign(user, app.get('secret'), {
            expiresIn: '7d' // expires in 7 days
          });

          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Authentication successful',
            token: token
          });
        }

      }

    });
	});

	// process the signup form
	app.post('/api/register', function(req, res) {

		var userInfos = {
			username: req.body.username || '',
			email: req.body.email || '',
			password: req.body.password,
			confirmPassword: req.body.confirmPassword
		};

		signup(userInfos, true, function(error, user, data) {
			if (error || !user) {
				console.log(data);
				res.json( { success: false, message: data } );
			} else {
        var token = jwt.sign(user, app.get('secret'), {
          expiresIn: '7d' // expires in 7 days
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Registration successful',
          token: token
        });
			}
		});

	});

	// PROFILE SECTION
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/api/register', isValidToken, function(req, res) {
    res.json( { success: true, user: req.user } );
	});

	// LOGOUT
	app.get('/api/logout', function(req, res) {

	});
};

// route middleware to make sure
function isValidToken(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {

        var user = {
          id: decoded._doc._id,
          email: decoded._doc.local.email,
          username: decoded._doc.profile.username,
          createdAt: decoded._doc.createdAt
        };

        // if everything is good, save to request for use in other routes
        req.user = user;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
}
