import { Component, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { AuthService } from './auth.service';

declare var $:any;
declare var gapi:any;
declare var FB: any;

@Component({
  selector : 'app-auth',
  templateUrl: './auth.component.html'
})

export class AuthComponent implements AfterViewInit {

  private email;
  private password;
  private returnUrl:string;

  public auth2: any;

  constructor(private _authService: AuthService, private _route: ActivatedRoute, private _router: Router, private el: ElementRef){
    FB.init({
      appId      : '1120118441421753',
      cookie     : true,
      xfbml      : true,
      version    : 'v2.8'
    });
    FB.AppEvents.logPageView();
  }

  onFacebookLoginClick() {
    this._authService.facebookHandler().subscribe((result) => {
      if (result.success) {
        this._router.navigateByUrl('/home/videos');
      } else {
        console.log("Registration failed !");
      }
    });

  }

  onFacebookLogout() {
      FB.logout(function(response) {
      // user is now logged out
    });
  }

  statusChangeCallback(resp) {
        if (resp.status === 'connected') {
            // connect here with your server for facebook login by passing access token given by facebook
        } else {

        }
  }

  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '668607930475-f9eh3cod33letpot7l3heepv0178t3ig.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignin(document.getElementById('googleBtn'));
    });
  }

  attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {
          this._authService.googleHandler(googleUser).subscribe((result) => {
            if (result.success) {
              this._router.navigateByUrl('/home/videos');
            } else {
              console.log("Registration failed !");
            }
          });

      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
      });
  }


  ngOnInit() {
        // reset login status
        this._authService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';

        FB.getLoginStatus(response => {
            this.statusChangeCallback(response);
        });
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

   this.googleInit();

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
