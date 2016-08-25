import { Component } from '@angular/core';
import { NavController, NavParams, reorderArray,Events } from 'ionic-angular';
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
  private pageType: String = "myCenter";


  private editButton: string = '编辑';
  private editing: boolean = false;

  constructor(
    private nav: NavController,
    private mapleConf: MapleConf,
    private parm: NavParams,
    private userData: UserData,
    private events: Events

  ) {


  }

  ionViewWillEnter() {

    this.userData.getUserData('myCenter').then(res => {

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
  gotoMap(lat,lng){
          this.events.publish('map:center', { lat: lat, lng: lng, type: 'HOUSE' });
  }

  remove(name) {
    this.userData.changeFavorite(name, this.pageType, 'd').then(res => {
      console.log("Remove MLS Result:" + res);
      this.centerList = this.centerList.filter(function (obj) {
        return obj.name !== name;
      });
    });


  }

  reorderItems(indexes) {
    this.centerList = reorderArray(this.centerList, indexes);

  }

  saveFavOrder() {

    let list = this.centerList.map(function (a) { return a.name; }).join();
    console.log(list);
    this.userData.changeFavorite(list, this.pageType, 'r').then(res => {
      console.log("My Center Result Reorder:" + res);

    });
  }

}
