import { Component} from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import {  houseModel } from '../../models/houseModel';
//import { houseListModel } from '../../models/houseListModel';

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
  
  public houseM = new houseModel;
  public isFav: boolean = false;


  constructor(public nav: NavController,private navParms: NavParams) {
    
   
  }

  ionViewWillLoad() {
   
    console.log('Hello HouseDetailMainPage Page');
      this.houseM = this.navParms.data.houseM;
    this.isFav = this.navParms.data.isFav;
   
  }

  houseViewSwipe(e){

  }
  

}
