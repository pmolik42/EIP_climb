import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { SignUpComponent } from './signUp/signUp.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { VideosFeedComponent } from './videos/feed/videos.component';
import { BattlesFeedComponent } from './battles/feed/battles.component'
import { NewsListComponent } from './news/news-list.component';
import { SettingsComponent } from './settings/settings-page.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileVideosComponent } from './profile/videos/videos.component';
import { BookComponent } from './profile/book/book.component';
import { OverviewComponent } from './settings/overview/overview.component';
import { SettingsProfileComponent } from './settings/profile/profile.component';

import { UploadComponent } from './upload/upload.component';
import { AuthGuard } from './_guards/index';

const appRoutes: Routes = [
  //redirections
  { path: '', redirectTo: '/home/videos', pathMatch: 'full' },
  { path: 'home', redirectTo: '/home/videos', pathMatch: 'full'},
  { path: 'profile', redirectTo: '/profile/videos', pathMatch: 'full' },
  { path: 'settings', redirectTo: '/settings/overview', pathMatch: 'full' },

  //routes
  { path: 'login', component: AuthComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: '', component: NavComponent, canActivate: [AuthGuard], children: [
    { path: 'upload', component: UploadComponent },
    { path: 'home', component: HomeComponent, children: [
      { path: 'videos', component: VideosFeedComponent },
      { path: 'battles', component: BattlesFeedComponent },
      { path: 'news', component: NewsListComponent }
    ]},
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], children: [
      { path: 'videos', component: ProfileVideosComponent},
      { path: 'book', component: BookComponent }
    ]},
    { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard], children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'editProfile', component: SettingsProfileComponent },
    ]}
  ] }
];

export const routing = RouterModule.forRoot(appRoutes);
