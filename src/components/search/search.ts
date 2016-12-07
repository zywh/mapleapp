import { Component, Input, Output, EventEmitter } from '@angular/core';
import {UserData} from '../../providers/user-data';
//import {HouseDetailPage} from '../../pages/house-detail/house-detail';
import { NavController,Events} from 'ionic-angular';
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
 // private _name;
  @Input() mapType: any = 0;
 // @Input('inputText') searchPlaceHolder: string = (this.mapType == 0) ? '城市/地址/MLS#' : '城市/学校';
  @Input() inputText;
  //  set inputText(inputText: string) {
  //   this._name = (inputText) || (this.mapType == 0) ? '城市/地址/MLS#' : '城市/学校';
  // }
  // get inputText(): string { return this._name; }
  @Output() searchInput = new EventEmitter();
  private cityItems;
  private addressItems;
  private mlsItems;
  private schoolItems;
  public currentDiv;
  public queryText ='';
  //public searchPlaceHolder;
  public searchValue='';
  //private defaultItems;


  constructor(
    public nav: NavController,
    private mapleRestData: MapleRestData,
    private userData: UserData,
    private mapleConf: MapleConf,
    private events: Events

  ) {

  }


  ngOnChanges(changes) { //Need wait after constructor
    console.log("search component:" + this.mapType);
    console.log(this.inputText);
    //console.log("search bar change event");
   // console.log(this.inputText);
  // this.searchPlaceHolder = (this.mapType == 0) ? '城市/地址/MLS#' : '城市/学校';
  /*
    if ( this.inputText != '' ){
      this.searchPlaceHolder = this.inputText;
      console.log("Search Componet input is not empty:" + this.inputText)
    }else {
      console.log("Search component is empty default")
      this.searchPlaceHolder = (this.mapType == 0) ? '城市/地址/MLS#' : '城市/学校';
    }
    */
    
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
    this.inputText = item.value;
    this.searchValue = item.value;
  
    this.searchInput.emit(item);

  }
  //auto complete REST CAll
  searchInFocus() {
    this.currentDiv = '';
    this.queryText = '';
    this.currentDiv = 'searchlist';
    this.resetItems();
    this.searchInput.emit('INFOCUS');
    
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
