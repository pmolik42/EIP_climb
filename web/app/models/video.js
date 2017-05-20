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

videoSchema.methods.copyVideo = (videoObject) => {
  var video = {};
  
  video._id = videoObject._id;
  video.title = videoObject.title;
  video.description = videoObject.description;
  video.ownerId = videoObject.ownerId;
  video.createdAt = videoObject.createdAt;
  video.updatedAt = videoObject.updatedAt;
  video.thumbnailUrl = videoObject.thumbnailUrl;
  video.url = videoObject.url;
  video.category = videoObject.category;
  
  return video;
}

// create the model for users and expose it to our app
module.exports = mongoose.model('Video', videoSchema);
