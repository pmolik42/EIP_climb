// app/models/like.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var voteSchema = mongoose.Schema({

  userId : String,
  battleId: String,
  video: Number,
  createdAt : Date

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Vote', voteSchema);
