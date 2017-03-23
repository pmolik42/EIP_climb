const isLoggedIn = require('../../middlewares.js').isLoggedIn;
const Article = require('../../models/article.js');
const async = require('async');

const homeRoutes = (app) => {

	app.get('/', (req, res) => {
		res.render('index.ejs', { data: req.session.data });
		delete req.session.data;
	});

	app.get('/home', isLoggedIn, (req, res) => {

		async.waterfall([
			(cb) => {
				Article.find({}).limit(5).sort('-updatedAt').exec((err, articles) => {
					if (err) return cb(err);
					cb(null, articles);
				});
			}
		], (err, results) => {
			if (err) throw err;
			console.log(results);
			res.render('pages/home.ejs', {
				user : req.user, // get the user out of session and pass to template
				articles : results
			});
		});

	});

};

module.exports = homeRoutes;
