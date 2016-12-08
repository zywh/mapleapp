import { Component } from '@angular/core';
import { NavController,NavParams,Events } from 'ionic-angular';
import { houseModel } from '../../models/houseModel';


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
  

  constructor(public navCtrl: NavController,private navparms: NavParams,private events:Events) {
    this.listenEvents();
  }


  ionViewDidLoad() {
    console.log("School Map new page will enter")
    console.log(this.navparms.data);
    this.mapType= this.navparms.data.mapType; // 0 for house and 1 for school
    this.center =  {'lat':this.navparms.data.center.lat,'lng':this.navparms.data.center.lng,'type': 2}; // 2 for school marker
    this.zoomlevel = this.navparms.data.zoomlevel;
    

    
  }


	listenEvents() {
		this.events.subscribe('housedetail:mlschange', (data) => {
      console.log("mls change event is detected")
		console.log(data);
     this.center = data[0].mapParms.center;
     this.mapType = data[0].mapParms.mapType;
     this.zoomlevel = data[0].mapParms.zoomlevel;
		});
	



	}

  setParms(parms){
    console.log("set map parms");
    console.log(parms);
    this.mapType = parms.mapType;
    this.center = parms.center;
    this.zoomlevel = parms.zoomlevel;
  }



}
