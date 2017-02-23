// string validation library to check user credentials
var validator = require('validator');

// load the user model
var User = require('../../models/user.js');

module.exports = function(userInfos, callback) {

  var errorMessages = checkUserInfosValidity(userInfos);

  if (errorMessages) {
    return callback(null, false, errorMessages);
  }

  // find a user whose email is the same as the forms email or its username
  // we are checking to see if the user trying to signup already exists
  User.findOne( { $or: [ {'local.email' : userInfos.email }, {'profile.username' : userInfos.username } ] }, function(err, user) {
      // if there are any errors, return the error before anything else
      var messages = {
        errors: {
          username : '',
          email: '',
          password : ''
        }
      };

      if (err)
        return callback(err);

      // if user is found, return the message
      if (user) {
        if (user.local.email == userInfos.email)
          messages.errors.email = 'This account already exists.';
        if (user.profile.username == userInfos.username)
          messages.errors.username = 'This username is taken.';
        return callback(null, false, messages);
      } else {
        if (!validator.equals(userInfos.password, userInfos.confirmPassword)) {
          messages.errors.password = 'The passwords are not matching.';
          return callback(null, false, messages);
        }
        var newUser = new User();

        newUser.local.email = userInfos.email;
        newUser.local.password = newUser.generateHash(userInfos.password);
        newUser.profile.username = userInfos.username;
        newUser.profile.verified = false;
        newUser.createdAt = new Date();
        newUser.updatedAt = new Date();

        console.log(newUser);
        newUser.save(function(err) {
          if (err)
            throw err;
          return callback(null, newUser);
        });
      }

      // all is well, return successful user
      return callback(null, user);
  });

};

var checkEmailValidity = function(email) {
  return validator.isEmail(email);
};

var checkUsernameValidity = function(username) {
  return validator.isAlphanumeric(username) && username.length >= 3;
};


// check if the user credentials are valid
var checkUserInfosValidity = function(userInfos) {

  var isValid = true;
  var messages = {
    errors: {
      username : '',
      email: ''
    }
  };

  if (checkEmailValidity(userInfos.email) == false) {
    messages.errors.email = 'Sorry, this email is not valid';
    isValid = false;
  }
  if (checkUsernameValidity(userInfos.username) == false) {
    messages.errors.username = 'Username must be alphanumerical, at least 3 characters';
    isValid = false;
  }

  return isValid ? null : messages;
};
