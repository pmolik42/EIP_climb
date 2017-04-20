// app/models/follower.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var followerSchema = mongoose.Schema({

  userId : String,
  followerId: String,
  createdAt : Date

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Follower', followerSchema);
