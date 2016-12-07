import { Content, NavController, NavParams, Events } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';;
import { MapleConf } from '../../providers/maple-rest-data/maple-config';


@Component({
  selector: 'page-map',
  templateUrl: 'map-search.html'
})


export class MapSearchPage {

  tabBarElement: any;
  @ViewChild(Content) content: Content;
  public mapInitialised: boolean = false;
  public center;
  public mapType: number = 1; // 0 for house and 1 for school
  public lockMapListener: boolean = false;
  public simpleMap: boolean = false;


  constructor(
    public nav: NavController,
    private mapleconf: MapleConf,
    private navparm: NavParams,
    private events: Events
  ) {


    this.mapType = this.navparm.data.pageType;
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');


  }




  ionViewWillEnter() {
    
    console.log("Map View will enter");
    this.content.resize(); //resize to have fab position after housedetail page is back
    this.lockMapListener = false; //unlock after view enter  




  }

  ionViewDidLoad() {


    if (this.nav.length() > 1) this.tabBarElement.style.display = 'none';

    if (this.navparm.data.parms.lat > 20) {
      this.center = { 'lat': this.navparm.data.parms.lat, 'lng': this.navparm.data.parms.lng, 'type': 1 };
    } else {

      if (this.mapleconf.location) {
        console.log("location exist");
        this.center = { 'lat': this.mapleconf.location.lat, 'lng': this.mapleconf.location.lng, 'type': 0 };
      } else {

        this.mapleconf.getLocation().then(data => {
          console.log("Get current location");
          console.log(data);

          this.center = { 'lat': data['lat'], 'lng': data['lng'], 'type': 0 };

        })

      }

    }


  }

  ionViewWillLeave() {
    console.log("Map view will leave");
    this.lockMapListener = true; //lock change map after view switch. workaround for android searchbar trigger map data refresh
  }





}


