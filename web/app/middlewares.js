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
  console.log("coucou");
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

//middleware to handle file uploading
//aws sdk for multer s3
const aws = require('aws-sdk');

//multer for upload
const multer  = require('multer');
//multer-s3 to upload to aws s3
const multerS3 = require('multer-s3');

// initialise amazon web service S3 object
var s3 = new aws.S3()

//initiate multer upload for usage
//var upload = multer({storage: video_storage, fileFilter: fileFilter}).single('video');
var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'testclemclimb',

    //if its a video upload also a thumbnail
    /*shouldTransform: function (req, file, cb) {
      cb(null, /^video/i.test(file.mimetype) && (typeof req.body.thumbnailUrl == "undefined" || req.body.thumbnailUrl == '' || req.body.thumbnailUrl == null));
    },
    transforms: [{
      id: 'thumbnail',
      key: function (req, file, cb) {
        cb(null, file.fieldname + 's/' + 'thumbnail' +  '-' + Date.now() + '.' + 'jpg'
      },
      transform: function (req, file, cb) {
        cb(null, sharp().jpg())
      }
    }, {
      id: 'video',
      key: function (req, file, cb) {
        cb(null, file.fieldname + 's/' + file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[1])
      },
    }]*/
    key: function (req, file, cb) {
      cb(null, file.fieldname + 's/' + file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[1])
    }
  }),
  fileFilter: function (req, file, cb) {
      if (RegExp("^" + file.fieldname, "i").test(file.mimetype)){
        cb(null, true);
      }
      else{
        req.fileValidationError = 'wrong mimetype uploaded';
        cb(null, false);
      }
    }
});
	module.exports = {
	  isLoggedIn : isLoggedIn,
      isTokenValid : isTokenValid,
      upload : upload,
	};
