var signup = require('./modules/auth/signup.js');

// app/routes.js
module.exports = function(app, passport) {

	app.get('/', function(req, res) {
		res.render('index.ejs', { data: req.session.data });
		delete req.session.data;
	});

	// process the login form
	app.post('/login', function(req, res) {
		passport.authenticate('local-login', function(error, user, data) {
    	if (error || !user) {
				req.session.data = data;
				return res.redirect('/');
			} else {
				req.login(user, function(err) {
					if (err)
						throw err;
					return res.redirect('/profile');
				});
			}
  	})(req, res);
	});

	// process the signup form
	app.post('/signup', function(req, res) {

		var userInfos = {
			username: req.param('username') || '',
			email: req.param('email') || '',
			password: req.param('password'),
			confirmPassword: req.param('confirmPassword')
		};

		signup(userInfos, false, function(error, user, data) {
			if (error || !user) {
				req.session.data = data;
				return res.redirect('/#toregister');
			} else {
				req.login(user, function(err) {
					if (err)
						throw err;
					return res.redirect('/profile');
				});
			}
		});

	});

	// PROFILE SECTION
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// LOGOUT
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
