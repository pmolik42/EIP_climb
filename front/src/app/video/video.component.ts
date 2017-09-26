import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { VideoService } from './video.service';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
  providers: [VideoService],
})

export class VideoComponent implements AfterViewInit {

  constructor(private route: ActivatedRoute,private _videoService: VideoService){}

private video;

  ngAfterViewInit() {
  this.route.paramMap
    .switchMap((params: ParamMap) => this._videoService.getVideo(params.get('id')))
    .subscribe((result) => {
      if (result.success) {
        this.video = result.video;
        console.log(this.video);
      } else {
        console.log('Video failed');
      }
    });
    console.log(this.video)
  }

  like(video: any) {
    this._videoService.likeVideo(video).subscribe((result) => {
      if (result.success) {
        video.isLiked = true;
        video.likes += 1;
      } else {
        console.log('Video like failed');
      }
    });
  }

  unlike(video: any) {
    this._videoService.unlikeVideo(video).subscribe((result) => {
      if (result.success) {
        video.isLiked = false;
        video.likes -= 1;
      } else {
        console.log('Video unlike failed');
      }
    });
  }


}
