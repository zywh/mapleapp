import { Component, Input } from '@angular/core';
import { UserData } from '../../providers/user-data';
import { HouseDetailPage } from '../../pages/house-detail/house-detail';
//import {HouseDetailTabsPage} from '../../pages/house-detail-tabs/house-detail-tabs';
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

    ngOnChanges(changes) {

        //  console.log('maple-map-search ngonchanges:' + this.mapType + "localListener:" + this.lockMapListener);

        //console.log(this.center);
        console.log(changes);

        //if (this.mapInput && !this.mapInitialised) {

        // no init if this.center doesn't exist
        //no init if mapinit is done once and no simplemap

        // if (this.center && (!this.mapInitialised || this.simpleMap)) {
        // let centerChange: boolean = false;
        // console.log("map ngchanges");
        // console.log(changes);

        // // for (let propName in changes) {
        // //     let chng = changes[propName];
        // let cur = JSON.stringify(changes['center'].currentValue);
        // let prev = JSON.stringify(changes['center'].previousValue);
        // // console.log('ngOnChanges property ' + propName + " prev value:" + prev + " current value:" + cur);
        // //if (propName == 'center' && cur != prev) {
        // if (cur != prev) {
        //     console.log('ngOnChanges property ');
        //     centerChange = true;
        // }

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
     this.nav.push(HouseDetailPage, { id: mls, list: this.houselist.list }); //segment single page view
    // this.nav.push(HouseDetailTabsPage,{ id: mls, list: this.houselist.list });   //house detail tabs view
    } else {
      this.userData.loginAlert();
    }


  }



  mapSearch(lat, lng) {
    this.events.publish('map:center', { lat: lat, lng: lng, type: 'HOUSE' });
  }

  


}
