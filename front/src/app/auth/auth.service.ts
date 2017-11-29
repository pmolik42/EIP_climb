import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/map';
import localStorage from 'localStorage';

export class User {
  constructor(
    public email: string,
    public password: string) { }
}

declare var FB:any;
declare var gapi:any;

@Injectable()
export class AuthService {

  private loggedIn = false;
  private baseUrl = environment.apiUrl;

  constructor(
    private _router: Router,
    private _http: Http){}

    facebookHandler() {
      const _http = this._http;
      return FB.login(function(response) {
        // handle the response
        FB.api('/me', {fields: 'name,first_name,last_name,email,gender,picture'}, function(response) {
            console.log("Response - > " + JSON.stringify(response))
            //console.log("Email -> " + response.email);
            if (response.email) {
              var name = response.name;
              var firstName = response.first_name;
              var last_name = response.last_name;
              var pictureUrl = response.picture.data.url;
              var gender = response.gender;
              var email = response.email;
              var route = "facebook";
              let headers = new Headers();
              headers.append('Content-Type', 'application/json');
              console.log('Going to send the api request');
              name = name.split(' ').join('')
              console.log("_http", this._http)
              console.log("wouhou", _http);
              return _http.post(
                this.baseUrl + '/register',
                JSON.stringify({'name': name, 'firstName': firstName, 'lastName': last_name ,'email': email,
                'pictureUrl': pictureUrl, 'gender': gender, 'route': route}),
                 {headers}
                ).map(res => res.json())
                .map((res) => {
                  console.log('Avant de print res')
                  if (res.success) {
                  console.log("Registration Successful !");
                  localStorage.setItem('token', res.token);
                  localStorage.setItem('username', res.user.profile.username);
                  }
                console.log('Res -> ' + JSON.stringify(res))
                  console.log('Return res')
                return res;
              });
            }
            else {
              alert("It seems that you didn't confirm the email address you use with Facebook :)")
            }
            //this._signUpService.facebookHandler(response.first_name, response.last_name, response.email, response.gender);
          });
          return this.res
        },{scope: 'email'});
  }

  googleHandler(googleUser) {
    let profile = googleUser.getBasicProfile();
    // console.log('Token || ' + googleUser.getAuthResponse().id_token);
    // console.log('ID: ' + profile.getId());
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail());
    // console.log(profile);
    var name = profile.getName();
    var email = profile.getEmail();
    var pictureUrl = profile.getImageUrl();
    var route = 'google';
    console.log(name + email + pictureUrl)
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    console.log('Going to send the api request');
    name = name.split(' ').join('')
    console.log(name);
    console.log("_http", this._http)
    return this._http.post(
      this.baseUrl + '/register',
      JSON.stringify({'name': name, 'email': email,
      'pictureUrl': pictureUrl, 'route': route}),
       {headers}
      ).map(res => res.json())
      .map((res) => {
        console.log('Avant de print res')
        if (res.success) {
        console.log("Registration Successful !");
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', res.user.profile.username);
        }
      console.log('Res -> ' + JSON.stringify(res))
        console.log('Return res')
      return res;
    });
}

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  }

  login(email, password) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this._http
      .post(
        this.baseUrl + '/authenticate',
        JSON.stringify({ 'email': email, 'password': password }),
        { headers }
      )
      .map(res => res.json())
      .map((res) => {
        console.log(res);
        if (res.success) {
          console.log("Authentification Successful !");
          localStorage.setItem('token', res.token);
          localStorage.setItem('username', res.user.profile.username);
          this.loggedIn = true;
        }

        return res;
      });
  }

  isLoggedIn() {
    return this.loggedIn;
  }

   checkCredentials() {
    if (localStorage.getItem("token") === null){
        this.loggedIn = false;
        this._router.navigate(['login']);
    }
  }
}
