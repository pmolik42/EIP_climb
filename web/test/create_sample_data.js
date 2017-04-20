const async = require('async');
const createArticles = require('./articles/create_articles.js');
const createUsers = require('./users/create_users.js');
const createVideos = require('./videos/create_videos.js');



const createSampleData = (callback) => {

    async.series({
      articles : (cb) => {
        createArticles((err, data) => {
          if (err) return cb(err);
          cb(null, data);
        });
      },
      users : (cb) => {
        createUsers((err, data) => {
          if (err) return cb(err);
          cb(null, data);
        });
      },
      videos : (cb) => {
        createVideos((err, data) => {
          if (err) return cb(err);
          cb(null, data);
        });
      }
    },
    (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    }
  );
};

module.exports = createSampleData;
