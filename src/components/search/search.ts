import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  templateUrl: 'search.html'
})
export class Search {
  @Input() mapType: any;
  @Output() searchInput = new EventEmitter();
  private cityItems;
  private addressItems;
  private mlsItems;
  private schoolItems;
  public currentDiv;
  public queryText ='';
  public searchPlaceHolder;
  //private defaultItems;


  constructor(
    public nav: NavController,
    private mapleRestData: MapleRestData,
    private userData: UserData,
    private mapleConf: MapleConf,
    private events: Events

  ) {

  }


  ngOnInit() { //Need wait after constructor
    this.searchPlaceHolder = (this.mapType == 0) ? '城市/地址/MLS#' : '城市/学校';
  }


  resetItems() {
    this.cityItems = [];
    this.addressItems = [];
    this.mlsItems = [];
    this.schoolItems = [];

  }


  itemTapped(item, type) {
    //this.searchInFocus = false;
    //let center = new google.maps.LatLng(item.lat, item.lng);

    this.currentDiv = '';
    this.queryText = '';
    this.searchPlaceHolder = item.value;
    console.log("item tapped:"+this.searchPlaceHolder);
    this.searchInput.emit(item);

  }
  //auto complete REST CAll
  searchInFocus() {
    this.currentDiv = '';
    this.queryText = '';
    this.currentDiv = 'searchlist';
    this.resetItems();
    
    //this.getDefaultcity();
   

  }
  searchBlur(){
    
  }

  
 getDefaultcity(){

      this.currentDiv = 'searchlist';
      //Call REST and generate item object
      let val = 'DEFAULTCITY'
      this.mapleConf.load().then(data => {
        let restUrl = data.getCitylistDataRest;
       
        this.mapleRestData.load(restUrl, { term: val }).subscribe(

          data => {
            

          }); //end of callback

        //}
      })

 }


  
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
              console.log(this.cityItems);

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
