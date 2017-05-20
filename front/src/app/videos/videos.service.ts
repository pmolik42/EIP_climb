import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/map';
import localStorage from 'localStorage';

@Injectable()
export class VideosService {

  private baseUrl = environment.apiUrl;

  constructor(
    private _http: Http){}

  likeVideo(video: any) {
    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('x-access-token', localStorage.getItem("token"));

    return this._http
      .post(
        this.baseUrl + '/videos/' + video._id + '/like',
        '',
        { headers: headers }
      )
      .map(res => res.json())
      .map((res) => {
        console.log(res);
        return res;
      });
  }

  unlikeVideo(video: any) {
    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('x-access-token', localStorage.getItem("token"));

    return this._http
      .delete(
        this.baseUrl + '/videos/' + video._id + '/like',
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

  getFeedVideos() {
    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('x-access-token', localStorage.getItem("token"));


    return this._http
      .get(
        this.baseUrl + '/videos/feed',
        { headers: headers }
      )
      .map(res => res.json())
      .map((res) => {
        console.log(res);
        return res;
      });
  }

}
