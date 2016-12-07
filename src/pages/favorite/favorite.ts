import { Component,ViewChild } from '@angular/core';
import { NavController, Content,NavParams, reorderArray } from 'ionic-angular';
import {HouseDetailPage} from '../house-detail/house-detail';
//import {HouselistSearch} from '../houselist-search/houselist-search';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
// import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {UserData} from '../../providers/user-data';
//import {HouseList} from '../../components/house-list/house-list';
import {houseListModel} from '../../models/houseListModel';

@Component({
  templateUrl: 'favorite.html'
})
export class FavoritePage {
   @ViewChild(Content) content: Content;
  public favList: houseListModel;
  public imgHost = '';
  public pageTitle;
  public pageType;
  public editButton: string = '编辑';
  public editing: boolean = false;
  public viewType: string = 'apps';
  public isList: boolean = true;
  
  

  constructor(
    public nav: NavController,
    private mapleConf: MapleConf,
    private parm: NavParams,
    private userData: UserData

  ) {
    this.pageType = parm.data.type;
    if (this.pageType == "houseFav") this.pageTitle = '我的房源收藏';
    if (this.pageType == "routeFav") this.pageTitle = '我的看房收藏';
    if (this.pageType == "recentView") this.pageTitle = '最近浏览房源';

  }

  ionViewWillEnter() {
   // this.content.resize();
    this.userData.getUserData(this.pageType).then(res => {
      this.imgHost = res.imgHost;
   
      this.favList = new houseListModel(res.HouseList,true);
    

    });



  }

  gotoHouseDetail(mls,address) {
    if (address && !this.editing){
      //this.nav.pop().then(() => this.nav.push(HouseDetailPage, { id: mls, list: this.favList }))
      this.nav.push(HouseDetailPage, { id: mls, list: this.favList.list });
      //this.nav.pop();
    }
    
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

   toggleView() {
    this.isList = !this.isList;
    if (this.isList) {
      this.viewType ='apps';
    } else {
     this.viewType = 'list-box';
    }
  }

  remove(mls) {
    this.userData.changeFavorite(mls, this.pageType, 'd').then(res => {
     
      this.favList.list = this.favList.list.filter(function (obj) {
        return obj.MLS !== mls;
      });
    });


  }

  reorderItems(indexes) {
    this.favList.list = reorderArray(this.favList.list, indexes);

  }

  saveFavOrder() {

    let list = this.favList.list.map(function (a) { return a.MLS; }).join();
   
    this.userData.changeFavorite(list, this.pageType, 'r').then(res => {
    

    });
  }

}
