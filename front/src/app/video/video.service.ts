import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/map';
import localStorage from 'localStorage';

@Injectable()
export class VideoService {

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

  getVideo(id) {
    console.log(id)
    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('x-access-token', localStorage.getItem("token"));


    return this._http
      .get(
        this.baseUrl + '/video/' + id,
        { headers: headers }
      )
      .map(res => res.json())
      .map((res) => {
        return res;
      });
  }


}
