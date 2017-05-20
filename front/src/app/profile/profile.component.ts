import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent {

  constructor(private _service: ProfileService, private router: Router){}

  private pictureProfil = "./../assets/img/profile_picture.jpg";
  private firstName = '';
  private lastName = '';
  private followers = 0;
  private following = 0;
  private battles = 0;
  private videos = 0;
  private username = '';
  private bio = '';
  private isFollowing = false;
  private isOwner = false;

  ngAfterViewInit() {
    this._service.getProfileData().subscribe((result) => {
      if (result.success) {
        this.pictureProfil = result.user.profile.pictureUrl;
        this.firstName = result.user.profile.firstName;
        this.lastName = result.user.profile.lastName;
        this.username = result.user.profile.username;
        this.followers = result.followers;
        this.following = result.following;
        this.bio = result.user.profile.bio;
        this.videos = 0;
        this.battles = 0;
        this.username = result.user.profile.username;
        this.isOwner = result.isOwner;
        this.isFollowing = result.isFollowing;
      } else {
        console.log("Authentification failed !");
      }
    });
  }
}
