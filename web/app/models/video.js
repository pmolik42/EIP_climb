// app/models/article.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var videoSchema = mongoose.Schema({

  title: String,
  description : String,
  ownerId : {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
      },
  category : String,
  thumbnailUrl : String,
  url: String,
  createdAt : Date,
  updatedAt: Date

});

var autoPopulate = function(next) {
  this.populate('ownerId', '-local');
  next();
};

videoSchema.
  pre('findOne', autoPopulate).
  pre('find', autoPopulate);

// create the model for users and expose it to our app
module.exports = mongoose.model('Video', videoSchema);
