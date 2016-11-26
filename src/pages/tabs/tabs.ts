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
    

    //this.listenEvents();
  }

  listenEvents() {
    this.events.subscribe('map:center', (data) => {
    

    });
    this.events.subscribe('schoolmap:center', (data) => {
    

    });
  }


}
