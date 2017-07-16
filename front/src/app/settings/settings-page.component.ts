import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { ProfileService } from '../profile/profile.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector : 'app-settings',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css']
})

export class SettingsComponent {

  constructor(private _authService: AuthService, private _router: Router, private _profileService: ProfileService){

  }

  ngAfterViewInit() {

  }

  logout() {
    this._authService.logout();
    this._router.navigate(['login']);
  }

}
