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



@Injectable()
export class AuthService {

  private loggedIn = false;
  private baseUrl = environment.apiUrl;

  constructor(
    private _router: Router,
    private _http: Http){}

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
