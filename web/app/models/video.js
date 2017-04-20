// app/models/article.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var videoSchema = mongoose.Schema({

  title: String,
  description : String,
  ownerId : String,
  category : String,
  thumbnailUrl : String,
  url: String,
  createdAt : Date,
  updatedAt: Date

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Video', videoSchema);
