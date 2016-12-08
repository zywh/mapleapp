import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';


/*
  Generated class for the HouseDetailMap page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-house-detail-map',
  templateUrl: 'house-detail-map.html'
})
export class HouseDetailMapPage {

  //public location ;
  public mapType;
  public center;
  public simpleMap:boolean = false;
  public zoomlevel;

  constructor(public navCtrl: NavController,private navparms: NavParams) {}


  ionViewWillEnter() {
    console.log("School Map new page will enter")
    console.log(this.navparms.data);
    this.mapType= this.navparms.data.mapType; // 0 for house and 1 for school
    this.center =  {'lat':this.navparms.data.center.lat,'lng':this.navparms.data.center.lng,'type': 2}; // 2 for school marker
    this.zoomlevel = this.navparms.data.zoomlevel;

    
  }

}
