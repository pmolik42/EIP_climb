const authRoutes = require('./modules/auth/routes.js');
const homeRoutes = require('./modules/home/routes.js');
const profileRoutes = require('./modules/profile/routes.js');


const configRoutes = (app, passport) => {
	authRoutes(app, passport);
	homeRoutes(app);
	profileRoutes(app);
};

module.exports = configRoutes;
