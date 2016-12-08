import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { houseModel } from '../../models/houseModel';

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

 public houseM = new houseModel;
  constructor(public navCtrl: NavController,private navParms: NavParams) {}

  ionViewWillLoad() {
     this.houseM = this.navParms.data.houseM;
  }

}
