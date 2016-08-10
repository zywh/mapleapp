import { Component } from '@angular/core';
import { NavController, NavParams, reorderArray } from 'ionic-angular';
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
  private imgHost = '';
  private pageTitle;
  private pageType;
  private editButton: string = '编辑';
  private editing: boolean = false;
  private songs;

  constructor(
    private nav: NavController,
    private mapleConf: MapleConf,
    private parm: NavParams,
    private userData: UserData

  ) {
    this.pageType = parm.data.type;
    if (this.pageType == "houseFav") this.pageTitle = '我的房源收藏';
    if (this.pageType == "routeFav") this.pageTitle = '我的看房收藏';

  }

  ionViewWillEnter() {

    this.userData.getUserData(this.pageType).then(res => {
      this.imgHost = res.imgHost;
      this.favList = res.HouseList;
      console.log(this.favList);

    });



  }


  gotoHouseDetail(mls) {
    this.nav.pop().then(() => this.nav.push(HouseDetailPage, { id: mls, list: this.favList }))
  }

  toggleEdit() {
    this.editing = !this.editing;
    if (this.editing) {
      this.editButton = '完成';
      this.saveFavOrder();
    } else {
      this.editButton = '编辑';
    }
  }

  map() {

  }
  remove(mls) {
    this.userData.changeFavorite(mls, this.pageType, 'd').then(res => {
      console.log("Remove MLS Result:" + res);
      this.favList = this.favList.filter(function (obj) {
        return obj.MLS !== mls;
      });
    });


  }

  reorderItems(indexes) {
    this.favList = reorderArray(this.favList, indexes);
  }

  saveFavOrder() {
    
  }

}
