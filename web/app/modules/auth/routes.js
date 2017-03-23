const signup = require('./signup.js');

// app/routes.js
const authRoutes = (app, passport) => {

	app.get('/', (req, res) => {
		res.render('pages/index.ejs', { data: req.session.data });
		delete req.session.data;
	});

	// process the login form
	app.post('/login', function(req, res) {
		passport.authenticate('local-login', (error, user, data) => {
    	if (error || !user) {
				req.session.data = data;
				return res.redirect('/');
			} else {
				req.login(user, (err) => {
					if (err)
						throw err;
					return res.redirect('/home');
				});
			}
  	})(req, res);
	});

	// process the signup form
	app.post('/signup', (req, res) => {

		let userInfos = {
			username: req.param('username') || '',
			email: req.param('email') || '',
			password: req.param('password'),
			confirmPassword: req.param('confirmPassword')
		};

		signup(userInfos, false, (error, user, data) => {
			if (error || !user) {
				req.session.data = data;
				return res.redirect('/#toregister');
			} else {
				req.login(user, (err) => {
					if (err)
						throw err;
					return res.redirect('/home');
				});
			}
		});

	});

	// LOGOUT
	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});
};

module.exports = authRoutes;
