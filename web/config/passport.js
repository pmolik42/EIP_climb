// config/passport.js

// load all the things we need
const LocalStrategy = require('passport-local').Strategy;

// load the user model
const User = require('../app/models/user.js');

// expose this function to our app using module.exports

const passport = (passport) => {

    passport.serializeUser(function(user, done) {
      done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });

    // local login
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    (req, email, password, done) => { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne( { $or: [ {'local.email' : email }, {'profile.username' : email } ] }, (err, user) => {
            // if there are any errors, return the error before anything else
            let messages = {
              errors: {
                username : '',
                password : ''
              }
            };

            if (err)
              return done(err);

            // if no user is found, return the message
            if (!user) {
              messages.errors.username = 'This account does not exist.';
              return done(null, false, messages);
            }

            // if the user is found but the password is wrong
            if (!user.validPassword(password)) {
              messages.errors.password = 'Oops! Wrong password.';
              return done(null, false, messages);
            }

            // all is well, return successful user
            return done(null, user);
        });

    }));

};

module.exports = passport;
