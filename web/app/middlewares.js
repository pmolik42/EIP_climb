const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('../config/config.js');

// route middleware to make sure the user is logged
const isLoggedIn = (req, res, next) => {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
};

// route middleware to make sure the token is valid
const isTokenValid = (req, res, next) => {

  // check header or url parameters or post parameters for token
  let token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, message: 'Failed to authenticate token.' });
      } else {

        let user = {
          id: decoded._doc._id,
          email: decoded._doc.local.email,
          username: decoded._doc.profile.username,
          pictureUrl : decoded._doc.profile.pictureUrl,
          createdAt: decoded._doc.createdAt,
          updatedAt: decoded._doc.updatedAt
        };

        // if everything is good, save to request for use in other routes
        req.user = user;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
};

	module.exports = {
	  isLoggedIn : isLoggedIn,
      isTokenValid : isTokenValid
	};
