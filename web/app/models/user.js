// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local : {
      email : { type: String, required: true, unique: true },
      password : { type: String, required: false },
    },
    facebook : {
        id : String,
        token : String,
        email : String,
        name : String
    },
    profile : {
      username : { type: String, required: true, unique: true },
      firstName : String,
      lastName : String,
      pictureUrl : String,
      gender : String,
      bio : String,
      verified : { type: Boolean }
    },
    createdAt : Date,
    updatedAt : Date
});

// methods
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.safeUser = (user) => {
  return {
    local : {
      email : user.local.email
    },
    profile : {
      username : user.profile.username,
      firstName : user.profile.firstName,
      lastName : user.profile.lastName,
      pictureUrl : user.profile.pictureUrl,
      gender : user.profile.gender,
      bio : user.profile.bio,
      verified : user.profile.verified
    },
    createdAt : user.createdAt,
    updatedAt : user.updatedAt
  };
}

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
