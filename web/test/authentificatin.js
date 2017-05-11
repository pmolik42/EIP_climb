  const expect = require('chai').expect;
const request = require('request');

const mongoose = require('mongoose');

const config = require('../config/config.js');
const User = require('../app/models/user.js');

// configuration
mongoose.connect(config.database.url); // connect to our database

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", (callback) => {
  console.log("Connection succeeded.");
});

const userTestSuccess = {
  email : '',
  username : '',
  password : '',
  confirmPassword : ''
};

const userTestFailure = {
  email : '',
  username : '',
  password : '',
  confirmPassword : ''
};

describe("Authentification", () => {
      
  describe("Authentification success", () => {
    
    it("Login Success", (done) => {
        var url = "http://localhost:8080/api/authenticate";
        request.post(url, {form : {email:'test', password:'test'} }, (err, httpResponse, body) => {
          expect(JSON.parse(body).success).to.equal(true);
          done();
        });
    });
    
    it("Signup Success", (done) => {
        var url = "http://localhost:8080/api/register";
        request.post(url, {form : {email:'toto@gmail.com', password:'toto', confirmPassword : 'toto', username: 'toto'}}, (err, httpResponse, body) => {
          expect(JSON.parse(body).success).to.equal(true);
          done();
        });
    });
    
  });

  describe("Authentification failure", () => {

        it("Bad email", (done) => {
        var url = "http://localhost:8080/api/authenticate";
        request.post(url, {form : {email:'essou', password:'test'} }, (err, httpResponse, body) => {
          expect(JSON.parse(body).success).to.equal(false);
          done();
        });
    });

        it("Bad password", (done) => {
        var url = "http://localhost:8080/api/authenticate";
        request.post(url, {form : {email:'test', password:'essou'} }, (err, httpResponse, body) => {
          expect(JSON.parse(body).success).to.equal(false);
          done();
        });
    });

        it("Username already taken", (done) => {
        var url = "http://localhost:8080/api/register";
        request.post(url, {form : {email:'toto@gmail.com', password:'toto', confirmPassword : 'toto', username: 'toto'}}, (err, httpResponse, body) => {
          expect(JSON.parse(body).success).to.equal(false);
          done();
        });
    });

        it("Bad username format (forbidden characters", (done) => {
        var url = "http://localhost:8080/api/register";
        request.post(url, {form : {email:'toto@gmail.com', password:'toto', confirmPassword : 'toto', username: '-______-'}}, (err, httpResponse, body) => {
          expect(JSON.parse(body).success).to.equal(false);
          done();
        });
    });

         it("Email already taken", (done) => {
        var url = "http://localhost:8080/api/register";
        request.post(url, {form : {email:'toto@gmail.com', password:'toto', confirmPassword : 'toto', username: 'titi'}}, (err, httpResponse, body) => {
          expect(JSON.parse(body).success).to.equal(false);
          done();
        });
    });

        it("Bad email format", (done) => {
        var url = "http://localhost:8080/api/register";
        request.post(url, {form : {email:'toto@', password:'toto', confirmPassword : 'toto', username: 'toto'}}, (err, httpResponse, body) => {
          expect(JSON.parse(body).success).to.equal(false);
          done();
        });
    });

        it("Bad password format (forbidden characters)", (done) => {
        var url = "http://localhost:8080/api/register";
        request.post(url, {form : {email:'toto@gmail.com', password:'-_-', confirmPassword : 'toto', username: 'toto'}}, (err, httpResponse, body) => {
          expect(JSON.parse(body).success).to.equal(false);
          done();
        });
    });

        it("Confirm doesn't match with password", (done) => {
        var url = "http://localhost:8080/api/register";
        request.post(url, {form : {email:'toto@gmail.com', password:'toto', confirmPassword : 'titi', username: 'toto'}}, (err, httpResponse, body) => {
          expect(JSON.parse(body).success).to.equal(false);
          done();
        });
    });

  });


  describe("Cleaning database", () => {

    it("Remove User Created", function(done) {
      User.find({'local.email' : 'toto@gmail.com'}).remove().exec(function(err) {
        expect(err).to.equal(null);
        done();
      });
    });
    
  });

});
