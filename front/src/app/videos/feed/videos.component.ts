import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { VideosService } from '../videos.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-feed-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosFeedComponent implements AfterViewInit {

  constructor(private _http: Http,private el: ElementRef,private _videosService: VideosService){}

  private baseUrl = environment.apiUrl;
  private videos = [];
  private challengedVideoId;
  private competitorVideoId;

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

  challenge(video: any) {
    this.challengedVideoId = video._id;
  }

  submit() {

console.log("challengedVideoId -> " + this.challengedVideoId)
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
                  data => function (challengedVideoId, _http, baseUrl) {
                    var competitorVideoId = data.video._id;
                    console.log("challengedVideoId -> "+challengedVideoId)
                    console.log("competitorVideoId -> "+competitorVideoId)
                    let headers2 = new Headers();
                    headers2.append('x-access-token', localStorage.getItem("token"));
                    headers2.append('Content-Type', 'application/json');
                    console.log("Before API call")
                    _http.post(baseUrl + "/battle", JSON.stringify({'video_1': challengedVideoId,
                    'video_2': competitorVideoId}), {headers: headers2})
                    .map((res:Response) => res.json()).subscribe(
                                //map the success function and alert the response
                                 (success) => {
                                    console.log(success);
                                         alert("success");
                                },
                                (error) => alert("error"))
                  }(this.challengedVideoId, this._http, this.baseUrl),
                  success => console.log("Success -> "+success),
                );
        }

      }
}
