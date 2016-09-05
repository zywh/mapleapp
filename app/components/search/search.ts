import { Component, Input,Output,EventEmitter } from '@angular/core';
import {UserData} from '../../providers/user-data';
import {HouseDetailPage} from '../../pages/house-detail/house-detail';
import { NavController, ModalController, Events} from 'ionic-angular';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';



/*
  Generated class for the Search component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'search',
  templateUrl: 'build/components/search/search.html'
})
export class Search {
  @Input() mapType: any;
  @Output() searchInput = new EventEmitter();
  private cityItems;
  private addressItems;
  private mlsItems;
  private schoolItems;
  private currentDiv;
  private queryText;


  constructor(
    public nav: NavController,
    private mapleRestData: MapleRestData,
    private userData: UserData,
    private mapleConf: MapleConf,
    private events: Events

  ) {

  }
  resetItems() {
    this.cityItems = [];
    this.addressItems = [];
    this.mlsItems = [];
    this.schoolItems = [];

  }


  itemTapped(item, type) {
    //this.searchInFocus = false;
    let center = new google.maps.LatLng(item.lat, item.lng);

    this.currentDiv = '';
    this.queryText = item.value;
    this.searchInput.emit(item);
    console.log("Set Center and clear text");
    // if (type == 1) {
    //   this.setLocation(center, this.defaultZoom, true);
    //   if (this.auth.authenticated()) {
    //     this.userData.saveCenter('recentCenter', item.value, item.lat, item.lng);
    //   }

    // } else if (type == 2) {
    //   this.nav.push(HouseDetailPage, { id: item.id })
    // }


  }
  //auto complete REST CAll

  getItems(ev) {

    this.resetItems();
    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.currentDiv = 'searchlist';
      //Call REST and generate item object
      this.mapleConf.load().then(data => {
        let restUrl = data.getCitylistDataRest;
        if (this.mapType == 1) {
          restUrl = data.getSchoolAcDataRest
        }
        this.mapleRestData.load(restUrl, { term: val }).subscribe(

          data => {
            if (data.hasOwnProperty("CITY")) {
              this.cityItems = data.CITY;

            };

            if (data.hasOwnProperty("MLS")) {
              this.mlsItems = data.MLS;

            }
            if (data.hasOwnProperty("ADDRESS")) {
              this.addressItems = data.ADDRESS;

            }
            if (data.hasOwnProperty("SCHOOL")) {
              this.schoolItems = data.SCHOOL;

            }

          }); //end of callback

        //}
      })
    }
  }
}
