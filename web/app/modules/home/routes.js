const isLoggedIn = require('../../middlewares.js').isLoggedIn;

const homeRoutes = (app) => {

	app.get('/', (req, res) => {
		res.render('index.ejs', { data: req.session.data });
		delete req.session.data;
	});

  // PROFILE SECTION
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, (req, res) => {
		res.render('pages/profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

};

module.exports = homeRoutes;
