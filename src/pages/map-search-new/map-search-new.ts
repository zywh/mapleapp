import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';

/*
  Generated class for the MapSearchNew page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-map-search-new',
  templateUrl: 'map-search-new.html'
})
export class MapSearchNewPage {
   public location ;
  constructor(public navCtrl: NavController,private navparms: NavParams) {}

  ionViewWillEnter() {
    console.log("Map new page will enter")
    
    this.location = this.navparms.data;
    console.log(this.location);
   // this.location = { 'lat': 44, 'lng': -79 }
   
  }



}
