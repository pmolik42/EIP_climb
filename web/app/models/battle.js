// app/models/battle.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var battleSchema = mongoose.Schema({

  id : String,
  category : String,
  videos : {type: [String]},
  likesCount : {type: [Number]},
  createdAt : Date

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Battle', battleSchema);
