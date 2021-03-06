import { Component } from '@angular/core';
import { NavController, NavParams, reorderArray,Events } from 'ionic-angular';
//import {HouseDetailPage} from '../house-detail/house-detail';
//import {HouselistSearch} from '../houselist-search/houselist-search';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
// import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {UserData} from '../../providers/user-data';
/*
  Generated class for the MyCenterPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'my-center.html'
})
export class MyCenterPage {
  public centerList;
  public pageType;
  public pageTitle;
  public editButton: string = '编辑';
  public editing: boolean = false;

  constructor(
    public nav: NavController,
    private mapleConf: MapleConf,
    private parm: NavParams,
    private userData: UserData,
    private events: Events

  ) {
    this.pageType = parm.data.type;
    if (this.pageType == "myCenter") this.pageTitle = '我的位置';
    if (this.pageType == "recentCenter") this.pageTitle = '最近搜索位置';
  }

  ionViewWillEnter() {

    this.userData.getUserSelections(this.pageType).then(res => {

      this.centerList = res;
     

    });



  }
  toggleEdit() {
    this.editing = !this.editing;
    if (this.editing) {
      this.editButton = '完成';
    } else {
      this.editButton = '编辑';
       this.userData.centerReorder(this.pageType, this.centerList);
    }
  }
  gotoMap(lat,lng){
          this.events.publish('map:center', { lat: lat, lng: lng, type: 'HOUSE' });
  }

  addCenter(){

  }

  remove(center) {
    let name = center.name;
    this.userData.deleteCenter(this.pageType,center).then(res => {
      console.log("Remove " + this.pageType + ":" + res);
      this.centerList = this.centerList.filter(function (obj) {
        return obj.name !== name;
      });
    });


  }

  reorderItems(indexes) {
    this.centerList = reorderArray(this.centerList, indexes);

  }

}
