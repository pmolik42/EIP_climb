import { Component, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { AuthService } from './auth.service';

declare var $:any;

@Component({
  selector : 'app-auth',
  templateUrl: './auth.component.html'
})

export class AuthComponent implements AfterViewInit {

  private email;
  private password;
  private returnUrl:string;

  constructor(private _authService: AuthService, private _route: ActivatedRoute, private _router: Router, private el: ElementRef){}
  
  ngOnInit() {
        // reset login status
        this._authService.logout();
 
        // get return url from route parameters or default to '/'
        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    this._authService.login(this.email, this.password).subscribe((result) => {
      if (result.success) {
        this._router.navigateByUrl('/home/videos');
      } else {
        console.log("Authentification failed !");
      }
    });
  }

  ngOnDestroy() {
      //$('#myModal1').destroy();
      //$('#myModal2').destroy();
      //$.backstretch();
      //$(this.el.nativeElement).
      $.backstretch("destroy", false);
      $('#myModal1 .close').click();
      $('#myModal2 .close').click();
      $("body").removeClass("modal-open");
      $('.modal-backdrop').remove();
    }

  ngAfterViewInit() {

    $.backstretch([
      [
        { "width": 1280, "fade": 4000, "url": "../../assets/img/index/dance-1_1920.jpg" },
        { "width": 960, "fade": 4000, "url": "../../assets/img/index/dance-1_1920.jpg" },
        { "width": 480, "fade": 4000, "url": "../../assets/img/index/dance-1_1920.jpg" },
        { "width": 0, "fade": 4000, "url": "../../assets/img/index/dance-1_1920.jpg" }
      ],
      [
        { "width": 1280, "fade": 4000, "url": "../../assets/img/index/dance-3_1920.jpg" },
        { "width": 960, "fade": 4000, "url": "../../assets/img/index/dance-3_1280.jpg" },
        { "width": 480, "fade": 4000, "url": "../../assets/img/index/dance-3_480.jpg" },
        { "width": 0, "fade": 4000, "url": "../../assets/img/index/dance-3_480.jpg" }
      ],
      [
        { "width": 1280, "fade": 4000, "url": "../../assets/img/index/instrumental-1_1920.jpg" },
        { "width": 960, "fade": 4000, "url": "../../assets/img/index/instrumental-1_1280.jpg" },
        { "width": 480, "fade": 4000, "url": "../../assets/img/index/instrumental-1_480.jpg" },
        { "width": 0, "fade": 4000, "url": "../../assets/img/index/instrumental-1_480.jpg" }
      ]
    ]);
    $('#myModal1').on('shown.bs.modal', function() {
      $('#autofocus-me').focus();
    });
    $('#myModal1').modal({ keyboard: false });
    $('#myModal1').on('hidden.bs.modal', function() {
      $('#myModal2').modal({ keyboard: true });
    });
    $('#myModal2').on('hidden.bs.modal', function() {
      $('#myModal1').modal({ keyboard: false });
    });
    $('#myModal2').click(function() {
      $('#modal-explain-close').click();
    });
    $(function() {
      $('#question-icon').tooltip();
      $('#question-icon').mouseover();
      setTimeout(function() {
        $('#question-icon').mouseout();
      }, 5000);
    });
  }

}
