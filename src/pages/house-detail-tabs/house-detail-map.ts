import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';


/*
  Generated class for the HouseDetailMap page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-house-detail-map',
  templateUrl: 'house-detail-map.html'
})
export class HouseDetailMapPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello HouseDetailMapPage Page');
  }

}
