import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/map';
import localStorage from 'localStorage';

// export class Profile {
//   constructor(
//     public email: string,
//     public username: string,
//     public followers: int,
//     public following: int ) { }
// }

@Injectable()
export class ProfileService {

  private baseUrl = environment.apiUrl;

  constructor(
    private _http: Http){}

  getProfileData() {
    let headers = new Headers();
    let username = localStorage.getItem("username");

    headers.append('Content-Type', 'application/json');
    headers.append('x-access-token', localStorage.getItem("token"));


    return this._http
      .get(
        this.baseUrl + '/profile/' + username,
        { headers: headers }
      )
      .map(res => res.json())
      .map((res) => {
        console.log(res);
        return res;
      });
  }

  getProfileVideos() {
    let headers = new Headers();
    let username = localStorage.getItem("username");

    headers.append('Content-Type', 'application/json');
    headers.append('x-access-token', localStorage.getItem("token"));


    return this._http
      .get(
        this.baseUrl + '/profile/' + username + '/videos',
        { headers: headers }
      )
      .map(res => res.json())
      .map((res) => {
        console.log(res);
        return res;
      });
  }

}
