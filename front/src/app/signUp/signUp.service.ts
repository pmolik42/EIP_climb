import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/map';
import localStorage from 'localStorage';


@Injectable()
export class SignUpService {

  private baseUrl = environment.apiUrl;

  constructor(
    private _router: Router,
    private _http: Http){}

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
