const async = require('async');

const User = require('../../models/user.js');
const Follower = require('../../models/follower.js');
const Video = require('../../models/video.js');
const Like = require('../../models/like.js');
const extend = require('util')._extend;


ObjectID = require('mongodb').ObjectID;

const isTokenValid = require('../../middlewares.js').isTokenValid;

upload = require('../../middlewares.js').upload.single('image');

const profileApiRoutes = (app) => {

  app.get('/api/profile/:username', isTokenValid, (req, res) => {
    const username = req.params.username || null;
    var profileUser = null;
    var isFollowing = false;

    async.series({
      user : (cb) => {
        User.findOne({'profile.username' : username}).select('-local.password').exec((err, user) => {
          if (err) return cb(err);
          if (!user) return cb('User not found');
          profileUser = user;
          cb(null, user);
        });
      },
      followers : (cb) => {
        Follower.find({userId : profileUser._id}).exec((err, followers) => {
          if (err) return cb(err);
          cb(null, followers.length);
        });
      },
      following : (cb) => {
        Follower.find({followerId : profileUser._id}).exec((err, following) => {
          if (err) return cb(err);
          cb(null, following.length);
        });
      },
      isFollowing : (cb) => {
        Follower.findOne({userId : profileUser._id, followerId : req.user.id}).exec((err, follower) => {
          isFollowing = follower == null ? false : true;
          if (err) return cb(err);

          cb(null, isFollowing);
        });
      }
    }, (err, results) => {
      if (err) return res.json({success : false, message : 'User not found'});

      res.json({success : true,
                user : results.user.safeUser(results.user),
                followers : results.followers,
                following : results.following,
                isOwner : req.user.username == username ? true : false,
                isFollowing : results.isFollowing
               });
    });
  });
  app.get('/api/profile/:username/videos', isTokenValid, (req, res) => {

    const username = req.params.username || null;
    let profileUser = null;

    async.series({
      user : (cb) => {
        User.findOne({'profile.username' : username}).select('profile.username profile.pictureUrl _id').exec((err, user) => {
          if (err) return cb(err);
          if (!user) return cb('User not found');
          profileUser = user;
          cb(null, user);
        });
      },
      videos : (cb) => {
        Video.find({ownerId : profileUser._id}).sort('-createdAt').limit(20).exec((err, videos) => {
          if (err) return cb(err);
          async.map(videos, (video, callback) => {
            let videoAdditionalData = video.toObject();
            Like.find({videoId: video._id}).exec((err, likes) => {
              if (err) return callback(err);
              videoAdditionalData.likes = likes.length;
              Like.findOne({userId: req.user.id, videoId: video._id}).exec((err, like) => {
                if (err) return callback(err);
                videoAdditionalData.isLiked = like ? true : false;
                callback(null, videoAdditionalData);
              });
            });
          }, (err, results) => {
            if (err) return cb(err);
            cb(null, results);
          });
        });
      }
    }, (err, results) => {
      if (err) return res.json({success : false, message : 'Videos not found'});

      res.json({success : true,
                videos : results.videos,
                username : results.videos[0].ownerId.profile.username,
                userProfilePicture : results.videos[0].ownerId.pictureUrl
               });
    });

  });

  app.post('/api/profile/follow/:username', isTokenValid, (req, res) => {

    const username = req.params.username || null;

    User.findOne({'profile.username': username}).then((user) => {
      if (!user) {
        throw 'User does not exist';
      } else return user;
    }).then((user) => {
      Follower.findOne({followerId: req.user.id, userId: user._id}).exec((err, follower) => {
        if (!follower) {
          let newFollower = new Follower();
          newFollower.userId = user._id;
          newFollower.followerId = req.user.id;
          newFollower.createdAt = new Date();
          return newFollower.save();
        }
        throw 'User is already followed';
      });
    }).then((model) => {
        res.json({success: true, message: 'Successfully followed'});
    }).catch((err) => {
      res.json({success: false, message: err});
    });
  });



  app.delete('/api/profile/follow/:username', isTokenValid, (req, res) => {

      const username = req.params.username || null;

      User.findOne({'profile.username': username}).then((user) => {
        if (!user) {
          throw 'User does not exist';
        } else return user;
      }).then((user) => {
        Follower.findOne({followerId: req.user.id, userId: user._id}).exec((err, Follower) => {
          if (follower) {
            return follower.remove();
          }
          throw 'User is not followed';
        });
      }).then((model) => {
          res.json({success: true, message: 'Successfully unfollowed'});
      }).catch((err) => {
        res.json({success: false, message: err});
      });

  });

// change route ????????????????????????????
  app.post('/api/profile/me/upload', isTokenValid, (req, res) => {

    upload(req, res, (err) => {
      if(req.fileValidationError) {
        return res.json({success: false, message: req.fileValidationError});
      }
      if(err) {
        console.log('Error Occured While uploading');
        console.log(err);
        return;
      }
      if (req.file == undefined)
        return res.json({success: false, message: "no file suplied"});
      User.update({_id: req.user.id}, {$set: {"profile.pictureUrl": req.file.location}}, (err, data) => {
        if (err)
          throw err;
        res.json({success: true, new_picture_url: req.file.location});
      });
    });
  });

  app.put('/api/profile', isTokenValid, (req, res) => {

    User.findOne({_id: req.user.id}).exec((err, user) => {
      if (err) return res.json({success: false, message: "Could not find user"});

      if (!user) return res.json({success: false, message: "Could not find user"});

      user.updatedAt = new Date();

      if (req.body.email) user.local.email = req.body.email;
      if (req.body.username) user.profile.username = req.body.username;
      if (req.body.firstName) user.profile.firstName = req.body.firstName;
      if (req.body.lastName) user.profile.lastName = req.body.lastName;
      if (req.body.bio) user.profile.bio = req.body.bio;
      if (req.body.gender) user.profile.gender = req.body.gender;

      user.save((err, newUser) => {
        if (err) return res.json({success: false, message: "Could not update profile"});

        res.json({success: true, message: 'update successful', newUser: user})
      });
    });
  });
  
  app.get('/api/profile', isTokenValid, (req, res) => {
    const username = req.query.username || '';
    var profileUser;

    async.series({
      user : (cb) => {
        User.findOne({'profile.username' : username}).select('-local.password').exec((err, user) => {
          if (err) return cb(err);
          if (!user) return cb('User not found');
          profileUser = user;
          cb(null, user);
        });
      },
      isFollowing : (cb) => {
        Follower.findOne({userId : profileUser._id, followerId : req.user.id}).exec((err, follower) => {
          isFollowing = follower == null ? false : true;
          if (err) return cb(err);

          cb(null, isFollowing);
        });
      }
    }, (err, results) => {
      if (err) return res.json({success : false, message : 'User not found'});

      res.json({success : true,
                user : results.user.safeUser(results.user),
                isOwner : req.user.username == username ? true : false,
                isFollowing : results.isFollowing
               });
    });

  });
};

module.exports = profileApiRoutes;
