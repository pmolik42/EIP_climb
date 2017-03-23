const authRoutes = require('./modules/auth/routes.js');
const homeRoutes = require('./modules/home/routes.js');

const configRoutes = (app, passport) => {
	authRoutes(app, passport);
	homeRoutes(app);
};

module.exports = configRoutes;
