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
        FB.api('/me', {fields: 'name,first_name,last_name,email,gender,picture'}, function(response) {
            console.log("Response - > " + response)
            console.log("Email -> " + response.email);
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
              console.log(name);
              return this._http.post(
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
              }, {scope: "email"});
            }
            else {
              alert("It seems that you didn't confirm the email address you use with Facebook :)")
            }
            //this._signUpService.facebookHandler(response.first_name, response.last_name, response.email, response.gender);
          });
        });
  }

  googleHandler(googleUser) {
    let profile = googleUser.getBasicProfile();

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
