const fs = require('fs');
const async = require('async');
const moment = require('moment');


const Article = require('../../app/models/article.js');

const createArticle = (article, cb) => {
    let newArticle = new Article();

    newArticle.title = article.title;
    newArticle.content = article.content;
    newArticle.url = article.url;
    newArticle.createdAt = moment(article.createdAt).toDate();
    newArticle.updatedAt = moment(article.updatedAt).toDate();

    newArticle.save((err, result) => {
      if (err) return cb(err);
      cb();
    });
};

const createArticles = (callback) => {

  async.waterfall([
    (cb) => {
      Article.find({}).limit(5).exec((err, articles) => {
        if (err) return cb(err);
        cb(null, articles);
      });
    },
    (articles, cb) => {
      if (articles && articles.length > 0) return cb(null, articles);

      fs.readFile('./test/articles/sample_data.json', (err, data) => {
        if (err) throw err;
        let articles = JSON.parse(data);
        async.each(articles, createArticle, (err, results) => {
          if (err) return cb(err);
          cb(null, articles);
        });
      });
    }

  ], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });

};

module.exports = createArticles;
