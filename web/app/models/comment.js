// app/models/like.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var commentSchema = mongoose.Schema({

  userId : String,
  videoId : String,
  text : String,
  createdAt : Date,
  updatedAt : Date

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Comment', commentSchema);
