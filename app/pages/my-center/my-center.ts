import { Component } from '@angular/core';
import { NavController, NavParams, reorderArray } from 'ionic-angular';
import {HouseDetailPage} from '../house-detail/house-detail';
import {HouselistSearch} from '../houselist-search/houselist-search';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
// import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {UserData} from '../../providers/user-data';
/*
  Generated class for the MyCenterPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/my-center/my-center.html',
})
export class MyCenterPage {
private centerList;
  

  private editButton: string = '编辑';
  private editing: boolean = false;
 
  constructor(
    private nav: NavController,
    private mapleConf: MapleConf,
    private parm: NavParams,
    private userData: UserData

  ) {
   

  }

  ionViewWillEnter() {

    this.userData.getMyCenter().then(res => {
      
      this.centerList = res;
      console.log(this.centerList);

    });



  }
   toggleEdit() {
    this.editing = !this.editing;
    if (this.editing) {
      this.editButton = '完成';
    } else {
      this.editButton = '编辑';
      this.saveFavOrder();
    }
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

    let list = this.favList.map(function (a) { return a.MLS; }).join();
    console.log(list);
    this.userData.changeFavorite(list, this.pageType, 'r').then(res => {
      console.log("MLS Result Reorder:" + res);

    });
  }

}
