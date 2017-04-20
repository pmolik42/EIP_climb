const fs = require('fs');
const async = require('async');
const moment = require('moment');


const Video = require('../../app/models/video.js');
const User = require('../../app/models/user.js');


const createVideo = (video, cb) => {
    let newVideo = new Video();

    newVideo.title = video.title;
    newVideo.description = video.description;
    newVideo.category = video.category;
    newVideo.url = video.url;
    newVideo.thumbnailUrl = video.thumbnailUrl;
    newVideo.ownerId = video.ownerId;
    newVideo.createdAt = moment(video.createdAt).toDate();
    newVideo.updatedAt = moment(video.updatedAt).toDate();

    newVideo.save((err, result) => {
      if (err) return cb(err);
      cb();
    });
};

const createVideos = (callback) => {

  async.waterfall([
    (cb) => {
      User.findOne({'profile.username' : 'test'}).select('_id').exec((err, user) => {
        if (err) return cb(err);
        cb(null, user);      
            
      });
    },
    (user, cb) => {
      Video.find({ownerId : user._id}).limit(5).exec((err, videos) => {
        if (err) return cb(err);
        cb(null, videos, user);
      });
    },
    (videos, user, cb) => {
      if (videos && videos.length > 0) return cb(null, videos);

      fs.readFile('./test/videos/sample_data.json', (err, data) => {
        if (err) throw err;
        let videos = JSON.parse(data);
        for (let i = 0; i < videos.length; i++) {
          videos[i].ownerId = user._id;
        }
        async.each(videos, createVideo, (err, results) => {
          if (err) return cb(err);
          cb(null, videos);
        });
      });
    }

  ], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });

};

module.exports = createVideos;
