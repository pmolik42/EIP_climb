import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/map';
import localStorage from 'localStorage';

declare var FB:any;
declare var gapi:any;

@Injectable()
export class SignUpService {

  private baseUrl = environment.apiUrl;

  constructor(
    private _router: Router,
    private _http: Http){}

    facebookHandler() {
      FB.login(function(response) {
        // handle the response
        FB.api('/me', {fields: 'first_name,last_name,email,gender'}, function(response) {
            console.log(response);
            //this._signUpService.facebookHandler(response.first_name, response.last_name, response.email, response.gender);
          });
        });
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
    var idToken = googleUser.getAuthResponse().id_token;
    console.log(name + email + pictureUrl + idToken)
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    console.log('Going to send the api request');
    console.log(this.baseUrl);
    return this._http.post(
      this.baseUrl + '/register/google/',
      JSON.stringify({'name': name, 'email': email,
      'pictureUrl': pictureUrl, 'idToken': idToken}),
       {headers}
      ).map(res => res.json())
      .map((res) => {
        console.log('Avant de print res')
        console.log(res);
        if (res.success) {
        console.log("Registration Successful !");
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', res.user.profile.username);
        }
      console.log('Res -> ' + res)
        console.log('Return res')
      return res;
    });
}

    signUp(username, email, password, confirmPassword, gender) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      return this._http.post(
        this.baseUrl + '/register',
        JSON.stringify({'username': username, 'email': email, 'password': password, 'confirmPassword': confirmPassword }),
        { headers }
      ).map(res => res.json())
      .map((res) => {
        console.log(res);
        if (res.success) {
          console.log("Registration Successful !");
          localStorage.setItem('token', res.token);
          localStorage.setItem('username', res.user.profile.username);
          let headers = new Headers();
          console.log(gender);
          headers.append('x-access-token', localStorage.getItem("token"));
          headers.append('Content-Type', 'application/json');
          this._http.put(this.baseUrl + "/profile", JSON.stringify({ 'gender': gender }), { headers: headers })
          .map((res) => res.json()).subscribe(
                      //map the success function and alert the response
                       (success) => {
                       		console.log(success);
                      },
                      (error) => console.log("error"))
        }

        return res;
      });
    }

}
