const async = require('async');

const User = require('../../models/user.js');
const Video = require('../../models/video.js');
const Follower = require('../../models/follower.js');
const Like = require('../../models/like.js');


const isTokenValid = require('../../middlewares.js').isTokenValid;


//ffmpeg for thumbnails
//var ffmpeg = require('fluent-ffmpeg');

//multer for upload
const multer  = require('multer');

// prepare multer storage
var video_storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads/videos');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[1]);
  }
});

//prepare filter for the file
function fileFilter (req, file, cb){
  var type = file.mimetype;
  var typeArray = type.split("/");
  if (typeArray[0] == "video") {
    cb(null, true);
  }else {
    console.log(typeArray[0]);
    req.fileValidationError = 'uploaded file is not a video';
    cb(null, false);
  }
}
//initiate multer upload for usage
var upload = multer({storage: video_storage, fileFilter: fileFilter}).single('video');



const findUserData = (video, users) => {
  for (let i = 0; i < users.length; i++) {
    if (video.ownerId == users[i]._id) {
      return {username : users[i].profile.username, profilePicture : users[i].profile.pictureUrl};
    }
  }
  return {};
}

const videosApiRoutes = (app) => {

  app.get('/api/videos/trending', isTokenValid, (req, res) => {
    //res.json(req.user);
  });

  app.get('/api/videos/feed', isTokenValid, (req, res) => {

    async.waterfall([
      (cb) => {
        Follower.find({followerId : req.user.id}).select('userId').exec((err, followers) => {
          if (err) return cb(err);
          cb(null, followers);
        });
      },
      (followers, cb) => {
        User.find({_id : { $in : followers}}).select('profile.pictureUrl profile.username _id').exec((err, users) => {
          if (err) return cb(err);
          cb(null, users, followers);
        });
      },
      (users, followers, cb) => {
        let feedVideosUsers = users;
        let usersId = followers;
        usersId.push(req.user.id);
        feedVideosUsers.push({profile: {username : req.user.username, pictureUrl : req.user.pictureUrl}, _id: req.user.id});
        Video.find({ownerId : { $in : usersId}}).limit(20).sort('-createdAt').exec((err, videos) => {
          if (err) return cb(err);
          async.map(videos, (video, callback) => {
            const user = findUserData(video, feedVideosUsers);
            let newVideo = video.copyVideo(video);
            newVideo.ownerUsername = user.username;
            newVideo.ownerProfilePicture = user.profilePicture;
            callback(null, newVideo);
          }, (err, results) => {
            if (err) return cb(err);
            cb(null, results);
          });

        });
      },
      (videos, cb) => {
        async.map(videos, (video, callback) => {
          Like.find({videoId: video._id}).exec((err, likes) => {
            if (err) return callback(err);
            var userVideo = video;
            userVideo.likes = likes.length;
            Like.findOne({userId: req.user.id, videoId: video._id}).exec((err, like) => {
              if (err) return callback(err);
              userVideo.isLiked = like ? true : false;
              callback(null, userVideo);
            });

          });
        }, (err, results) => {
          if (err) return cb(err);
          cb(null, results);
        });
      }

    ], (err, results) => {
      if (err) return res.json({success : false, message : 'No videos found'});

      res.json({success : true, videos : results});
    });


  });

  app.post('/api/videos/:videoId/like', isTokenValid, (req, res) => {
    const videoId = req.params.videoId || '';

    Video.findOne({_id: videoId}).then((video) => {
      if (!video) {
        throw 'Video does not exist';
      } else return video;
    }).then((video) => {
      Like.findOne({videoId: video._id, userId: req.user.id}).exec((err, like) => {
        if (!like) {
          let newLike = new Like();
          newLike.userId = req.user.id;
          newLike.videoId = videoId;
          newLike.createdAt = new Date();
          return newLike.save();
        }
        throw 'Video is already liked';
      });
    }).then((model) => {
        res.json({success: true, message: 'Successfully liked'});
    }).catch((err) => {
      res.json({success: false, message: err});
    });
  });

  app.post('/api/videos/upload', isTokenValid, (req, res) => {

    upload(req, res, (err) => {
      if(req.fileValidationError) {
              return res.json({success: false, message: req.fileValidationError});
        }
      if(err) {
        console.log('Error Occured While uploading');
        return;
      }

      var newVideo = Video();
      newVideo.title = req.body.title || '';
      newVideo.description = req.body.description ||'';
      newVideo.ownerId = req.user.username;
      newVideo.category = req.body.category || 'undefined';
      //if thumbnails not defined in request
      /*if (typeof req.body.thumbnailUrl == "undefined" || req.body.thumbnailUrl == '' || req.body.thumbnailUrl == null){
        var proc = new ffmpeg(req.file.path)
        .takeScreenshots({
        count: 1,
        timemarks: [ '10' ],//at 10s of the video
        folder: './uploads/thumbnails',
        filename: 'thumbnail-%b.png'
          // number of seconds
        }, function(err) {
        console.log('screenshots were saved');
        });
      }*/
      // see ffmpeg lib to generate one
      newVideo.thumbnailUrl = req.body.thumbnailUrl || '';
      newVideo.url = req.file.path;
      newVideo.createdAt = Date.now();
      newVideo.updatedAt = Date.now();
      newVideo.save((err, data) => {
        if (err)
          throw err;
        res.json({success: true, video: newVideo});
      });
    });
  });

  app.delete('/api/videos/:videoId/like', isTokenValid, (req, res) => {
    const videoId = req.params.videoId || '';

    Video.findOne({_id: videoId}).then((video) => {
      if (!video) {
        throw 'Video does not exist';
      } else return video;
    }).then((video) => {
      Like.findOne({videoId: video._id, userId: req.user.id}).exec((err, like) => {
        if (like) {
          return like.remove();
        }
        throw 'Video is not liked';
      });
    }).then((model) => {
        res.json({success: true, message: 'Successfully disliked'});
    }).catch((err) => {
      res.json({success: false, message: err});
    });
  });
};

module.exports = videosApiRoutes;
