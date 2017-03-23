const async = require('async');
const createArticles = require('./articles/create_articles.js');


const createSampleData = (callback) => {

    async.series({
      articles : (cb) => {
        createArticles((err, data) => {
          if (err) return cb(err);
          cb(null, data);
        });
      },
    },
    (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    }
  );
};

module.exports = createSampleData;
