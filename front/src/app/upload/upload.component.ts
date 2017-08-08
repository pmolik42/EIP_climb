import { Component,  ElementRef } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
@Component({
  selector : 'app-home',
  templateUrl: './upload.component.html'
})

export class UploadComponent {

  private baseUrl = environment.apiUrl;
    constructor(
    private _router: Router,
    private _http: Http,
     private el: ElementRef){}

  submit() {

  	let video: HTMLInputElement = this.el.nativeElement.querySelector('#video').files.item(0);
  	let title: HTMLInputElement = this.el.nativeElement.querySelector('#title').value;
  	let description: HTMLInputElement = this.el.nativeElement.querySelector('#description').value;
  	let formData = new FormData();
  	if (video != null && title != null){
  		formData.append('video', video);
  		formData.append('title', title);
  		if (description != null)
  			formData.append('description', description);
  		let headers = new Headers();

      	headers.append('x-access-token', localStorage.getItem("token"));
      	console.log(formData);
  		this._http.post(this.baseUrl + "/videos/upload", formData, { headers: headers })
  		.map((res:Response) => res.json()).subscribe(
                  //map the success function and alert the response
                   (success) => {
                   		console.log(success);
                           alert("success");
                  },
                  (error) => alert("error"))
    }

  }
}
