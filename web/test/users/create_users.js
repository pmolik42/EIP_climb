const fs = require('fs');
const async = require('async');
const moment = require('moment');


const User = require('../../app/models/user.js');


const createUser = (user, cb) => {
    let newUser = new User();

    newUser.local.email = user.email;
    newUser.profile.username = user.username;
    newUser.local.password = newUser.generateHash(user.password);
    newUser.profile.firstName = user.firstName;
    newUser.profile.lastName = user.lastName;
    newUser.profile.pictureUrl = user.pictureUrl;
    newUser.profile.bio = user.bio;
    newUser.profile.gender = user.gender;
    newUser.profile.verified = true;
    newUser.createdAt = moment().toDate();
    newUser.updatedAt = moment().toDate();

    newUser.save((err, result) => {
      if (err) return cb(err);
      cb();
    });
};

const createUsers = (callback) => {

  async.waterfall([
    (cb) => {
      User.find({'profile.username' : { $in : ['admin', 'test'] } }).limit(2).select('_id').exec((err, users) => {
        if (err) return cb(err);
        cb(null, users);
      });
    },
    (users, cb) => {
      if (users && users.length > 0) return cb(null, users);

      fs.readFile('./test/users/sample_data.json', (err, data) => {
        if (err) throw err;
        let users = JSON.parse(data);
        async.each(users, createUser, (err, results) => {
          if (err) return cb(err);
          cb(null, users);
        });
      });
    }

  ], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });

};

module.exports = createUsers;
