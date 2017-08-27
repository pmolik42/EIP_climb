const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('../../../config/config.js');

const User = require('../../models/user.js');
const signup = require('./signup.js');

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

	});


// process the google user creation
app.post('api/register/google', (req, res) => {

	let userInfos = {
		username : req.body.name || '',
		email: req.body.email || '',
		pictureUrl: req.body.pictureUrl,
		idToken: req.body.idToken
	};
	console.console.log(userInfos);
	console.log('Creating the new User');
	var newUser = new User();

	newUser.local.email = userInfos.email;
	newUser.profile.username = userInfos.username;
	newUser.profile.firstName = '';
	newUser.profile.lastName = '';
	newUser.profile.bio = '';
	newUser.profile.pictureUrl = userInfos.pictureUrl;
	newUser.profile.gender = '';
	newUser.profile.verified = false;
	newUser.createdAt = new Date();
	newUser.updatedAt = new Date();

	newUser.save((err, data) => {
		if (err)
			throw err;
		return callback(null, data);
	});

	var token = userInfos.idToken;
	// return the information including token as JSON
	res.json({
		success: true,
		message: 'Registration successful',
		user: user.safeUser(user),
		token: token
	});
});

	// LOGOUT
	app.get('/api/logout', (req, res) => {

	});
};

module.exports = authApiRoutes;
