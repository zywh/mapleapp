import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {HouseDetailPage} from '../house-detail/house-detail';
import {HouselistSearch} from '../houselist-search/houselist-search';
// import {MapleConf} from '../../providers/maple-rest-data/maple-config';
// import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {UserData} from '../../providers/user-data';

/*
  Generated class for the FavoritePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/favorite/favorite.html',
})
export class FavoritePage {

  constructor(
    private nav: NavController, 
    // private mapleRestData: MapleRestData,
    // private mapleConf: MapleConf
    private userData: UserData
   
  ) {}
  
   ionViewWillEnter() {
   
    let res = this.userData.getUserData('HouseFav');
    console.log(res);


  }
  

}
