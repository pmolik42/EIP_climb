const async = require('async');

const User = require('../../models/user.js');
const Follower = require('../../models/follower.js');
const Video = require('../../models/video.js');



const isTokenValid = require('../../middlewares.js').isTokenValid;

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
    var profileUser = null;
    
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
          cb(null, videos);
        });
      }
    }, (err, results) => {
      if (err) return res.json({success : false, message : 'Videos not found'});
      
      res.json({success : true,
                videos : results.videos,
                username : username,
                userProfilePicture : profileUser.profile.pictureUrl
               });  
    });
    
  });

};

module.exports = profileApiRoutes;
