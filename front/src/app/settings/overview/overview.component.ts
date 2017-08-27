import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../../profile/profile.service';
import { SettingsComponent } from '../settings-page.component';


declare var gapi:any;
declare const FB: any;

@Component({
  selector : 'app-settings-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})

export class OverviewComponent {

public auth2: any;


  constructor(private _service: ProfileService, private router: Router){}

  nSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}


  ngAfterViewInit(){

  (<any>window).fbAsyncInit = function() {
    FB.init({
      appId      : '1120118441421753',
      cookie     : true,
      xfbml      : true,
      version    : 'v2.8'
    });
    FB.AppEvents.logPageView();
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
  }
//   ngAfterViewInit() {
//     this._service.getProfileData().subscribe((result) => {
//       if (result.success) {
//         this.user = result.user;
//       } else {
//         console.log("Authentification failed !");
//       }
//     });
//   }
//
//   statusChangeCallback(response: any) {
//     if (response.status === 'connected') {
//         console.log('connected');
//     } else {
//         this.login();
//     }
// }
//
// login() {
//   FB.login((result: any) => {
//     this.loged = true;
//     this.token = result;
//   }, { scope: 'user_friends' });
// }
//
// me() {
//     FB.api('/me?fields=id,name,first_name,gender,picture.width(150).height(150),age_range,friends',
//         function(result) {
//             if (result && !result.error) {
//                 this.user = result;
//                 console.log(this.user);
//             } else {
//                 console.log(result.error);
//             }
//         });
// }
//
//   OnInit() {
//     FB.getLoginStatus(response => {
//         this.statusChangeCallback(response);
//     });
// }

}
