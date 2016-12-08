import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { houseInterface, houseModel } from '../../models/houseModel';
import { houseListModel } from '../../models/houseListModel';

/*
  Generated class for the HouseDetailMain page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-house-detail-main',
  templateUrl: 'house-detail-main.html'
})
export class HouseDetailMainPage {
  public houseM;
  public isFav;


  constructor(public nav: NavController,private navParms: NavParams) {
    // this.houseM = this.navParms.data.houseM;
    // this.isFav = this.navParms.data.isFav;
  }

  ionViewDidLoad() {
    console.log('Hello HouseDetailMainPage Page');
  }
  

}
