import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the CommunityStats page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-community-stats',
  templateUrl: 'community-stats.html'
})
export class CommunityStatsPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello CommunityStatsPage Page');
  }

}
