import { Component, Input, Output,ElementRef, ViewChild,EventEmitter } from '@angular/core';
import { Slides } from 'ionic-angular';
import { houseInterface, houseModel } from '../../models/houseModel';
//import { houseListModel } from '../../models/houseListModel';
import { MapleConf } from '../../providers/maple-rest-data/maple-config';
//import { MapleRestData } from '../../providers/maple-rest-data/maple-rest-data';
import { UserData } from '../../providers/user-data';
//import { HouseCityStatsPage } from '../../pages/house-city-stats/house-city-stats';
import { AuthService } from '../../providers/auth/auth';
//import { ShareService } from '../../providers/share';

/*
  Generated class for the HouseDetailView component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'house-detail-view',
  templateUrl: 'house-detail-view.html'
})
export class HouseDetailViewComponent {
  @Input() houseM: houseModel;
  @Input() isFav;
  @Output() swipFlag = new EventEmitter();
  @ViewChild('maphouse') mapElement: ElementRef;

  //public isFav = { houseFav: false, routeFav: false };
  public isMore: Boolean = true; //more buttom will be disabled before toast is dismiss
  public parms = { id: '', list: [], VOWtoken: '' };
  public houseList = { prev: '', next: '', index: 0, total: 0 };

  public isAndroid: boolean = false;
  public switchF2M: boolean = true; //"Meter"
  public rooms: Array<Object> = [];
  public house_mname: any;
  public house_propertyType: any;
  //public photos: Array<string>;
  //public cdn_photos: Array<string>;
  public exchangeRate: number;
  public username: string;

  public house: houseInterface;
  public rx_phone: string;
  public COMP_PTS = { "N": "北", "S": "南", "W": "西", "E": "东" };
  public S_R = { "Sale": "出售", "Lease": "出租" };
  public F2M = { feet: "尺", meter: "米", sfeet: "平方英尺", smeter: "平方米" };
  public location;

	swiperOptions = {
		//loop: true,
		autoHeight: true,
		pager: true,
		speed: 1000,
		autoplay: 3000
	};

  @ViewChild('photo_slider') slider: Slides;


  constructor(
    private mapleConf: MapleConf,
    private userData: UserData,
    public auth: AuthService
  ) {



  }


  ngOnChanges(changes) {
    console.log("house detail view component on changes event");
    console.log(this.houseM);
    this.location = { 'lat': this.houseM.house.latitude, 'lng': this.houseM.house.longitude };
  }

  gotoVideo() {
    if (this.houseM.house.tour_url) window.open(this.houseM.house.tour_url, "_blank");
		/*this.platform.ready().then(() => {
				if (this.houseM.house.tour_url) cordova.InAppBrowser.open(this.houseM.house.tour_url, "_system", "location=true");
		})*/
  }

  f2m() {
    //this.houseM.getLandArea(this.switchF2M);
    //this.houseM.houseRooms(this.switchF2M);
    this.houseM.switchF2M = this.switchF2M;
  }


  mapDirection() {
    this.mapleConf.mapDirection(this.houseM.house.latitude, this.houseM.house.longitude)
  }

	swipeEvent(e) {
    console.log(e);
		this.swipFlag.emit(e);

	}


  fav(type) {
    //type = 0 for houseFav and 1 for RouteFav
    this.userData.favWrapper(this.houseM.house.ml_num, type).then(res => {
      console.log(this.houseM.house.ml_num + "Return:" + res);
      switch (res) {
        case 'C': //mls doesn't exist .Add MLS into fav'
          if (type == 'houseFav') { this.isFav.houseFav = true; }
          if (type == 'routeFav') { this.isFav.routeFav = true; }
          break;
        case 'D': //mls exist . Remove MLS from fav
          if (type == 'houseFav') { this.isFav.houseFav = false; }
          if (type == 'routeFav') { this.isFav.routeFav = false; }
          break;
        default:
          console.log("Add fav is aborted");
      }

    })




  }

}
