import { Component, Input } from '@angular/core';
import { UserData } from '../../providers/user-data';
import { HouseDetailPage } from '../../pages/house-detail/house-detail';
import { NavController,  ModalController, Events } from 'ionic-angular';
import { MapleConf } from '../../providers/maple-rest-data/maple-config';
import { MapleRestData } from '../../providers/maple-rest-data/maple-rest-data';
import { MapHouselist } from '../../pages/map-search/map-houselist';
import {houseListModel } from '../../models/houseListModel';
import { AuthService } from '../../providers/auth/auth';

@Component({
  selector: 'house-list',
  templateUrl: 'house-list.html'
})
export class HouseList {
  @Input() houselist: houseListModel;
 // @Input() houselist: any;
  @Input() imgHost: String;
  @Input() fav: Boolean;
  @Input() isList: Boolean;
  //private data;
  private nearbyHouseList;
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


  ngInit(){
   // this.houseListM.setList(this.houselist);
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
      this.nav.push(HouseDetailPage, { id: mls, list: this.houselist.list });
    } else {
      this.userData.loginAlert();
    }


  }



  nearByHouses(lat, lng, mls) {


    let range: number = 0.015;

    let swLat = lat - range;
    let swLng = lng - range;
    let neLat = lat + range;
    let neLng = lng + range;
    let bounds = swLat + "," + swLng + "," + neLat + "," + neLng;
    let mapParms = {

      bounds: bounds,
      centerLat: lat,
      centerLng: lng,
      type: 'nearby',
      sr: 'Sale'
    };

    this.mapleConf.load().then(data => {
      //this.postListRest = data.postRest;
      let restURL = data.mapHouseRest;

      this.mapleRestData.load(restURL, mapParms).subscribe(
        data => {
          console.log(data);
          if (data.Data.Type == 'house') {

            this.nearbyHouseList = data.Data.HouseList;
            // let modal = this.modalc.create(MapHouselist, { list: this.nearbyHouseList, imgHost: this.imgHost });
            // modal.present();
            this.nav.push(MapHouselist, { list: this.nearbyHouseList, imgHost: this.imgHost });
            //console.log(this.nearbyHouseList);


          }
        });

    });




  }

  mapSearch(lat, lng) {
    this.events.publish('map:center', { lat: lat, lng: lng, type: 'HOUSE' });
  }

  


}
