import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/map';
import localStorage from 'localStorage';

@Injectable()
export class BattlesService {

  private baseUrl = environment.apiUrl;

  constructor(
    private _http: Http){}

  voteBattle(battle: any, vote: any) {
    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('x-access-token', localStorage.getItem("token"));

    return this._http
      .post(
        this.baseUrl + '/battles/' + battle._id + '/vote',
        {vote: vote},
        { headers: headers }
      )
      .map(res => res.json())
      .map((res) => {
        console.log(res);
        return res;
      });
  }

  unvoteBattle(battle: any) {
    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('x-access-token', localStorage.getItem("token"));

    return this._http
      .delete(
        this.baseUrl + '/battles/' + battle._id + '/vote',
        { headers: headers }
      )
      .map(res => res.json())
      .map((res) => {
        console.log(res);
        return res;
      });
  }

  getProfileBattles() {
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

  getFeedBattles() {
    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('x-access-token', localStorage.getItem("token"));


    return this._http
      .get(
        this.baseUrl + '/battles/feed',
        { headers: headers }
      )
      .map(res => res.json())
      .map((res) => {
        console.log(res);
        return res;
      });
  }

}
