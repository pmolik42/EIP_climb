// app/models/battle.js
// load the things we need
// ref tuto : https://alexanderzeitler.com/articles/mongoose-referencing-schema-in-properties-and-arrays/

var mongoose = require('mongoose');

// define the schema for our user model
var battleSchema = mongoose.Schema({

  category : String,
  video_1 : {
  		video : {
        	type: mongoose.Schema.Types.ObjectId,
        	ref: 'Video'
    	},
    	author : {
    		type: mongoose.Schema.Types.ObjectId,
        	ref: 'User'
    	},
	},
  video_2 : {
  		video : {
        	type: mongoose.Schema.Types.ObjectId,
        	ref: 'Video'
    	},
  		author : {
    		type: mongoose.Schema.Types.ObjectId,
        	ref: 'User'
    	},
	},
  createdAt : Date

});

//auto populate for the refs
var autoPopulate = function(next) {
  this.populate({
  path: 'video_1.video',
  model: 'Video',
  });

  this.populate({
  path: 'video_2.video',
  model: 'Video',
  });
  next();
};

battleSchema.
  pre('findOne', autoPopulate).
  pre('find', autoPopulate);

// create the model for users and expose it to our app
module.exports = mongoose.model('Battle', battleSchema);
