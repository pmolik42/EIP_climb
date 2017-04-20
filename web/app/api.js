const authApiRoutes = require('./modules/auth/api.js');
const profileApiRoutes = require('./modules/profile/api.js');
const videoApiRoutes = require('./modules/videos/api.js');


const configApiRoutes = (app) => {
	authApiRoutes(app);
	profileApiRoutes(app);
    videoApiRoutes(app);
};

module.exports = configApiRoutes;
