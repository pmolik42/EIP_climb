import { Component, AfterViewInit } from '@angular/core';
import { VideosService } from '../../videos/videos.service';

@Component({
  selector: 'app-profile-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class ProfileVideosComponent implements AfterViewInit {

  constructor(private _videosService: VideosService){}

  private videos = [];
  private userProfilePicture = '';
  private ownerUsername = '';

  ngAfterViewInit() {
    this._videosService.getProfileVideos().subscribe((result) => {
      if (result.success) {
        this.videos = result.videos;
        this.userProfilePicture = result.userProfilePicture;
        this.ownerUsername = result.username;
      } else {
        console.log('Videos profile failed');
      }
    });
  }

  like(video: any) {
    this._videosService.likeVideo(video).subscribe((result) => {
      if (result.success) {
        video.isLiked = true;
        video.likes += 1;
      } else {
        console.log('Video like failed');
      }
    });
  }

  unlike(video: any) {
    this._videosService.unlikeVideo(video).subscribe((result) => {
      if (result.success) {
        video.isLiked = false;
        video.likes -= 1;
      } else {
        console.log('Video unlike failed');
      }
    });
  }

}
