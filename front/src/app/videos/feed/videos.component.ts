import { Component, AfterViewInit } from '@angular/core';
import { VideosService } from '../videos.service';

@Component({
  selector: 'app-feed-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosFeedComponent implements AfterViewInit {

  constructor(private _videosService: VideosService){}

  private videos = [];

  ngAfterViewInit() {
    this._videosService.getFeedVideos().subscribe((result) => {
      if (result.success) {
        this.videos = result.videos;
        console.log(this.videos);
      } else {
        console.log('Videos feed failed');
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
