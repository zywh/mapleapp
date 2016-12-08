import { Component, Input } from '@angular/core';
import { UserData } from '../../providers/user-data';
import { HouseDetailPage } from '../../pages/house-detail/house-detail';
import {HouseDetailTabsPage} from '../../pages/house-detail-tabs/house-detail-tabs';
import { NavController,  ModalController, Events } from 'ionic-angular';
import { MapleConf } from '../../providers/maple-rest-data/maple-config';
import { MapleRestData } from '../../providers/maple-rest-data/maple-rest-data';
//import { MapHouselist } from '../../pages/map-search/map-houselist';
import {houseListModel } from '../../models/houseListModel';
import { AuthService } from '../../providers/auth/auth';

@Component({
  selector: 'house-list',
  templateUrl: 'house-list.html'
})
export class HouseList {
  @Input() houselist: houseListModel;
 // @Input() houselist: any;
  @Input() imgHost?: String;
  @Input() fav?: boolean;
  @Input() isList?: boolean;
  //private data;
  //private nearbyHouseList;
  public houseListM: houseListModel;
  //public houselist: Array<houseShort>;
  public vowShow: Object;
  constructor(
    private userData: UserData,
    private mapleConf: MapleConf,
    private mapleRestData: MapleRestData,
    private modalc: ModalController,
    //public houseListM: houseListModel,
    private events: Events,
    public auth: AuthService,
    private nav: NavController
  ) {
   
    this.listenEvents();
    //this.houseListM = new houseListModel; 

  }



  listenEvents() {
    this.events.subscribe('user:login', () => {
        
          this.houselist.setVowMask(true);
     
    });

    this.events.subscribe('user:logout', () => {
        
      this.houselist.setVowMask(false);
    
    });
  }

  gotoHouseDetail(mls, flag) {

    if (flag) {
     // this.nav.push(HouseDetailPage, { id: mls, list: this.houselist.list });
     this.nav.push(HouseDetailTabsPage,{ id: mls, list: this.houselist.list });
    } else {
      this.userData.loginAlert();
    }


  }



  mapSearch(lat, lng) {
    this.events.publish('map:center', { lat: lat, lng: lng, type: 'HOUSE' });
  }

  


}
