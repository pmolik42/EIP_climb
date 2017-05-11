import { Component, AfterViewInit } from '@angular/core';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profile-videos',
  templateUrl: './videos.component.html'
})

export class ProfileVideosComponent implements AfterViewInit {

  constructor(private _service: ProfileService){}

  private videos = [];
  private userProfilePicture = '';
  private ownerUsername = '';

  ngAfterViewInit() {
    this._service.getProfileVideos().subscribe((result) => {
      if (result.success) {
        this.videos = result.videos;
        this.userProfilePicture = result.userProfilePicture;
        this.ownerUsername = result.username;
      } else {
        console.log('Videos profile failed');
      }
    });
  }

}
