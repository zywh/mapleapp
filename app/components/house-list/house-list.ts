import { Component, Input } from '@angular/core';
import {UserData} from '../../providers/user-data';
import {HouseDetailPage} from '../../pages/house-detail/house-detail';
import { NavController, reorderArray, ModalController} from 'ionic-angular';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {MapHouselist} from '../../pages/map-search/map-houselist';

@Component({
  selector: 'house-list',
  templateUrl: 'build/components/house-list/house-list.html'
})
export class HouseList {
  @Input() houselist: any;
  @Input() imgHost: String;
  @Input() fav: Boolean;
  private data;
  private nearbyHouseList;
  constructor(
    private userData: UserData,
    private mapleConf: MapleConf,
    private mapleRestData: MapleRestData,
    private modalc: ModalController,
    private nav: NavController
  ) {
      //console.log("list type:" + this.fav + this.imgHost);
  }

  gotoHouseDetail(mls) {
    this.nav.push(HouseDetailPage, { id: mls, list: this.houselist });
  }


  nearByHouses(lat, lng,mls) {
    

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
            //this.imgHost = data.Data.imgHost;
            this.nearbyHouseList = data.Data.HouseList;
            // let modal = this.modalc.create(MapHouselist, { list: this.nearbyHouseList, imgHost: this.imgHost });
            // modal.present();
            this.nav.push(MapHouselist,{ list: this.nearbyHouseList, imgHost: this.imgHost });
            console.log(this.nearbyHouseList);
          
             //this.nav.push(HouseDetailPage, { id: mls, list: this.houselist });
            
          }
        });

    });




  }




}
