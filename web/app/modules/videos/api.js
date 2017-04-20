const async = require('async');

const User = require('../../models/user.js');
const Video = require('../../models/video.js');
const Follower = require('../../models/follower.js');

const isTokenValid = require('../../middlewares.js').isTokenValid;

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
          let usersVideos = [];
          async.each(videos, (video, callback) => {
            const user = findUserData(video, feedVideosUsers);
            let newVideo = {};
            newVideo.ownerUsername = user.username;
            newVideo.ownerProfilePicture = user.profilePicture;
            newVideo.updatedAt = video.updatedAt,
            newVideo.createdAt = video.createdAt,
            newVideo.ownerId = video.ownerId,
            newVideo.thumbnailUrl = video.thumbnailUrl,
            newVideo.url = video.url,
            newVideo.category = video.category,
            newVideo.description = video.description,
            newVideo.title = video.title,
            usersVideos.push(newVideo);
            callback();
          }, (err) => {
            if (err) return cb(err);
            cb(null, usersVideos);
          });
          
        });
      }
      
    ], (err, results) => {
      if (err) return res.json({success : false, message : 'No videos found'});
      
      res.json({success : true, videos : results});
    });
    
    
  });

};

module.exports = videosApiRoutes;
