import {NavParams, Events, NavController, Tabs} from 'ionic-angular';
import {Component, ViewChild} from '@angular/core';;
import {AboutPage} from '../about/about';
import {MapSearchPage} from '../map-search/map-search';
import {ProjectsPage} from '../projects/projects';
import {StatsPage} from '../stats/stats';
//import {SchoolMapPage} from '../school-map/school-map';
import {HomePage} from '../home/home';
import {ProfilePage} from '../profile/profile';
//import {MapleConf} from './providers/maple-rest-data/maple-config';

export interface MapParmObj {
  lat?: number,
  lng?: number
  type?: string
}
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('mcTabs') public tabRef: Tabs;
  // set the root pages for each tab
  public home: any = HomePage;
  public map: any = MapSearchPage;
  public project: any = ProjectsPage;
  public profile: any = ProfilePage;
 // public school: any = SchoolMapPage;
  public school: any = MapSearchPage;
  public stats: any = StatsPage;
  public about: any = AboutPage;
  public mySelectedIndex: number;
  public mapParms: MapParmObj;
  public tabMapParms;
  public tabSchoolParms;
  public preload: Boolean = true;



  constructor(private nav: NavController, navParams: NavParams, private events: Events) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
    this.mapParms = navParams.data.rootParms || { lat: 0, lng: 0, type: "NONE" };
    this.tabMapParms = { pageType: 0, parms: this.mapParms };
    this.tabSchoolParms = { pageType: 1, parms: this.mapParms };
    console.log("rootParms");
    console.log(this.mapParms);


    //this.listenEvents();
  }

  // schoolTabSelected(){
  //   //console.log("School Tab is selected");
  //   //this.events.publish("tab:schoolmap");
  //   // this.nav.setRoot(TabsPage ,{ tabIndex: 2 });
  //    this.nav.setRoot(SchoolMapPage);
  // }
  listenEvents() {
    this.events.subscribe('map:center', (data) => {
      // console.log("Map Center event:")
      // this.mapParms = data[0];
      // this.tabRef.select(1);
      // this.mySelectedIndex = 1;


    });
    this.events.subscribe('schoolmap:center', (data) => {
      console.log("Map Center event:")
      // this.mapParms = data[0];
      //this.tabRef.select(2);
      // this.mySelectedIndex = 2;

    });
  }


}
