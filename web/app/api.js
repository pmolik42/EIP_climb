const authApiRoutes = require('./modules/auth/api.js');

const configApiRoutes = (app) => {
	authApiRoutes(app);
};

module.exports = configApiRoutes;
