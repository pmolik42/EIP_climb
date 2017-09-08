import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AuthGuard } from './_guards/index';
import { AuthService } from './auth/auth.service';
import { ProfileService } from './profile/profile.service';
import { VideosService } from './videos/videos.service';
import { BattlesService } from './battles/battles.service';


import { AppComponent } from './app.component';
import { routing } from './app.routing';

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

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    SignUpComponent,
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
    SettingsProfileComponent,
    UploadComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [
    AuthGuard,
    AuthService,
    ProfileService,
    VideosService,
    BattlesService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
