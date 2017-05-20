import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes }   from '@angular/router';

import { AuthService } from './auth/auth.service';
import { ProfileService } from './profile/profile.service';
import { VideosService } from './videos/videos.service';


import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
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


const appRoutes: Routes = [
  { path: '', redirectTo: '/home/videos', pathMatch: 'full' },
  { path: 'home', redirectTo: '/home/videos', pathMatch: 'full' },
  { path: 'profile', redirectTo: '/profile/videos', pathMatch: 'full' },
  { path: 'login', component: AuthComponent },
  { path: '', component: NavComponent, children: [
    { path: 'home', component: HomeComponent, children: [
      { path: 'videos', component: VideosFeedComponent },
      { path: 'battles', component: BattlesFeedComponent },
      { path: 'news', component: NewsListComponent }
    ]},
    { path: 'profile', component: ProfileComponent, children: [
      { path: 'videos', component: ProfileVideosComponent},
      { path: 'book', component: BookComponent }
    ]},
    { path: 'settings', redirectTo: '/settings/overview', pathMatch: 'full' },
    { path: 'settings', component: SettingsComponent, children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'editProfile', component: SettingsProfileComponent },
    ]}
  ] }
];

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    NavComponent,
    HomeComponent,
    VideosFeedComponent,
    BattlesFeedComponent,
    NewsListComponent,
    SettingsComponent,
    ProfileComponent,
    ProfileVideosComponent,
    BookComponent,
    OverviewComponent,
    SettingsProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    AuthService,
    ProfileService,
    VideosService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
