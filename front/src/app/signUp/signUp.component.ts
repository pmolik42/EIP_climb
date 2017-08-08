import { Component, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { SignUpService } from './signUp.service';
import {NgForm} from '@angular/forms';

declare var $:any;

@Component({
  selector : 'app-signUp',
  templateUrl: './signUp.component.html',
  providers: [SignUpService]
})

export class SignUpComponent implements AfterViewInit {

  private username;
  private confirmPassword;
  private email;
  private password;
  private gender;

  public genders = [{"label": "Male", "name": "male"},
                    {"label": "Female", "name": "female"},
                    {"label": "Other", "name": "other"}
                    ]

constructor(private _signUpService: SignUpService, private _route: ActivatedRoute, private _router: Router, private el: ElementRef){}

onSubmit(f: NgForm) {
  this._signUpService.signUp(this.username, this.email, this.password, this.confirmPassword, this.gender).subscribe((result) => {
    if (result.success) {
      this._router.navigateByUrl('/home/videos');
    } else {
      console.log("Registration failed !");
    }
  });
}

onGenderChange(gender) {
  this.gender = gender;
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
