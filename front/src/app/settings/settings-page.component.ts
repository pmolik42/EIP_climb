import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';

@Component({
  selector : 'app-settings',
  templateUrl: './settings-page.component.html'
})

export class SettingsComponent {

  constructor(private _authService: AuthService, private _router: Router){}


  logout() {
    this._authService.logout();
  }

}
