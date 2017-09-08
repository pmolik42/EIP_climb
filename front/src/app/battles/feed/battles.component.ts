import { Component } from '@angular/core';
import { BattlesService } from '../battles.service';

@Component({
  selector: 'home-battles',
  templateUrl: './battles.component.html',
  styleUrls: ['./battles.component.css']
})
 
 export class BattlesFeedComponent {
   constructor(private _battlesService: BattlesService){}

  private battles = [];

  ngAfterViewInit() {
    this._battlesService.getFeedBattles().subscribe((result) => {
      if (result.success) {
        this.battles = result.battles;
        console.log(this.battles);
      } else {
        console.log('battles feed failed');
      }
    });
  }

  vote(battle: any, vote: any) {
    this._battlesService.voteBattle(battle, vote).subscribe((result) => {
      if (result.success) {
      	if (vote == 1){
      		if (battle.video_2.isVoted == true){
      			battle.video_2.votes > 0 ? battle.video_2.votes -= 1 : battle.video_2.votes = 0;
      		}
      		battle.video_1.isVoted = true;
      		battle.video_2.isVoted = false;
      		battle.video_1.votes += 1;
      	}
      	else if (vote == 2)
      	{

      		if (battle.video_1.isVoted == true){
      			battle.video_1.votes > 0 ? battle.video_1.votes -= 1 : battle.video_1.votes = 0;
      		}
      		battle.video_2.isVoted = true;
      		battle.video_1.isVoted = false;

      		battle.video_2.votes += 1;

      	}
      } else {
        console.log('battle like failed');
      }
    });
  }

  unvote(battle: any) {
    this._battlesService.unvoteBattle(battle).subscribe((result) => {
      if (result.success) {
      	if (battle.video_1.isVoted == true) {
      		battle.video_1.votes -= 1
      	}
      	if (battle.video_2.isVoted == true) {
      		battle.video_2.votes -= 1
      	}
      	battle.video_1.isVoted = false;
      	battle.video_2.isVoted = false;
      } else {
        console.log('battle unlike failed');
      }
    });
  }
 }