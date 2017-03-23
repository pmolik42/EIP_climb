const isLoggedIn = require('../../middlewares.js').isLoggedIn;

const homeRoutes = (app) => {

	app.get('/', (req, res) => {
		res.render('index.ejs', { data: req.session.data });
		delete req.session.data;
	});

	app.get('/home', isLoggedIn, (req, res) => {
		res.render('pages/home.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

};

module.exports = homeRoutes;
