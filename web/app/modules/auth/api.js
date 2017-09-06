const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('../../../config/config.js');

const User = require('../../models/user.js');
const signup = require('./signup.js');
const googleSignup = require('./googleSignup.js')

const isTokenValid = require('../../middlewares.js').isTokenValid;

const authApiRoutes = (app) => {

	// process the login form
	app.post('/api/authenticate', (req, res) => {
    // find the user
    User.findOne( { $or: [ { 'local.email': req.body.email }, { 'profile.username': req.body.email } ] }).exec((err, user) => {

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
            token: token,
            user: user.safeUser(user)
          });
        }

      }

    });
	});

	// process the signup form
	app.post('/api/register', (req, res) => {
		// Google signup
		if (req.body.route == 'google') {

			let userInfos = {
				username : req.body.name || '',
				email: req.body.email || '',
				pictureUrl: req.body.pictureUrl
			};

			User.findOne( { $or: [ {'local.email' : userInfos.email }, {'profile.username' : userInfos.username } ] }, function(err, user) {
		      // if there are any errors, return the error before anything else
		      var messages = {
		        errors: {
		          username : '',
		          email: ''
		        }
		      };

		      if (err)
		        return callback(err);

		      // if user is found, return the message
		      if (user) {
		        if (user.local.email == userInfos.email) {
		          messages.errors.email = 'This account already exists.';
							var token = jwt.sign(user, app.get('secret'), {
								expiresIn: '7d' // expires in 7 days
							});


							// return the information including token as JSON
							res.json({
								success: true,
								message: 'Authentication successful',
								token: token,
								user: user.safeUser(user)
							});
		        }
					}
					else {
						googleSignup(userInfos, true, (error, user, data) => {
							if (error || !user) {
								res.json( { success: false, message: data } );
							} else {
								var token = jwt.sign(user, app.get('secret'), {
									expiresIn: '7d' // expires in 7 days
								});

								// return the information including token as JSON
								res.json({
									success: true,
									message: 'Registration successful',
									user: user.safeUser(user),
									token: token
								});
							}
						});
					}
		  });



		}

		// Facebook signup
		else if (req.body.route == 'facebook') {

			let userInfos = {
				username : req.body.name || '',
				firstName: req.body.firstName || '',
				lastName: req.body.lastName || '',
				email: req.body.email || '',
				gender: req.body.email || '',
				pictureUrl: req.body.pictureUrl
			};

			User.findOne( { $or: [ {'local.email' : userInfos.email }, {'profile.username' : userInfos.username } ] }, function(err, user) {
		      // if there are any errors, return the error before anything else
		      var messages = {
		        errors: {
		          username : '',
		          email: ''
		        }
		      };

		      if (err)
		        return callback(err);

		      // if user is found, return the message
		      if (user) {
		        if (user.local.email == userInfos.email) {
		          messages.errors.email = 'This account already exists.';
							var token = jwt.sign(user, app.get('secret'), {
								expiresIn: '7d' // expires in 7 days
							});


							// return the information including token as JSON
							res.json({
								success: true,
								message: 'Authentication successful',
								token: token,
								user: user.safeUser(user)
							});
		        }
					}
					else {
						facebookSignup(userInfos, true, (error, user, data) => {
							if (error || !user) {
								res.json( { success: false, message: data } );
							} else {
								var token = jwt.sign(user, app.get('secret'), {
									expiresIn: '7d' // expires in 7 days
								});

								// return the information including token as JSON
								res.json({
									success: true,
									message: 'Registration successful',
									user: user.safeUser(user),
									token: token
								});
							}
						});
					}
		  });




		}

		// Regular signup
		else {
			let userInfos = {
				username: req.body.username || '',
				email: req.body.email || '',
				password: req.body.password,
				confirmPassword: req.body.confirmPassword
			};

			signup(userInfos, true, (error, user, data) => {
				if (error || !user) {
					res.json( { success: false, message: data } );
				} else {
					var token = jwt.sign(user, app.get('secret'), {
						expiresIn: '7d' // expires in 7 days
					});

					// return the information including token as JSON
					res.json({
						success: true,
						message: 'Registration successful',
						user: user.safeUser(user),
						token: token
					});
				}
			});

		}
	});


// process the google user creation
app.post('api/register/google', (req, res) => {


});

	// LOGOUT
	app.get('/api/logout', (req, res) => {

	});
};

module.exports = authApiRoutes;
