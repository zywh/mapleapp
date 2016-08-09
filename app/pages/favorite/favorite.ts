import { Component } from '@angular/core';
import { NavController,NavParams,reorderArray } from 'ionic-angular';
import {HouseDetailPage} from '../house-detail/house-detail';
import {HouselistSearch} from '../houselist-search/houselist-search';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
// import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {UserData} from '../../providers/user-data';

@Component({
  templateUrl: 'build/pages/favorite/favorite.html',
})
export class FavoritePage {
  private favList;
  private imgHost;
  private pageTitle;
  private pageType;

  constructor(
    private nav: NavController,
    private mapleConf: MapleConf,
    private parm: NavParams,
    private userData: UserData

  ) {
    this.pageType = parm.data.type;
    if (this.pageType == "HouseFav") this.pageTitle = '我的房源收藏';
    if (this.pageType == "RouteFav") this.pageTitle = '我的看房收藏';
   
   }

  ionViewWillEnter() {

    this.userData.getUserData(this.pageType).then(res => {
      this.imgHost = res.imgHost;
      this.favList = res.HouseList;

    });



  }


  gotoHouseDetail(mls) {
    this.nav.pop().then(() => this.nav.push(HouseDetailPage, { id: mls, list: this.favList }))
  }

  
  reorderItems(indexes) {
    this.favList = reorderArray(this.favList, indexes);
  }

}
