import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../../profile/profile.service';
import { SettingsComponent } from '../settings-page.component';


@Component({
  selector : 'app-settings-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent {

  public user = {
    profile: {
    usernmame: '',
    firstName: '',
    lastName: '',
    pictureUrl: '../../../assets/img/profile_picture.jpg',
    bio: '',
    gender: '' },
    local: {
      email: ''
    }
  };

  constructor(private _service: ProfileService, private router: Router){}

  ngAfterViewInit() {
    this._service.getProfileData().subscribe((result) => {
      if (result.success) {
        this.user = result.user;
      } else {
        console.log("Authentification failed !");
      }
    });
  }
}
