import {NavParams,Events,NavController,Tabs} from 'ionic-angular';
import {Component,ViewChild} from '@angular/core';;
import {AboutPage} from '../about/about';
import {MapSearchPage} from '../map-search/map-search';
import {ProjectsPage} from '../projects/projects';
import {StatsPage} from '../stats/stats';
import {SchoolSearchPage} from '../school-search/school-search';
import {SchoolMapPage} from '../school-map/school-map';
import {MapPage} from '../map/map';
import {HomePage} from '../home/home';
//import {MapleConf} from './providers/maple-rest-data/maple-config';

interface MapParmObj {
 lat?: Number,
 lng?: Number
 type?: String
}
@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  @ViewChild('mcTabs') tabRef: Tabs;
  // set the root pages for each tab
  home: any = HomePage;
  map: any = MapSearchPage;
  project: any = ProjectsPage;
  school: any = SchoolMapPage;
  //school: any = MapPage;
  stats: any = StatsPage;
  about: any = AboutPage;
  mySelectedIndex: number;
  mapParms: MapParmObj ;



  constructor(private nav: NavController, navParams: NavParams,private events: Events) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
    this.mapParms = navParams.data.rootParms || {};
    this.listenEvents();
  }

  schoolTabSelected(){
    //console.log("School Tab is selected");
    //this.events.publish("tab:schoolmap");
    // this.nav.setRoot(TabsPage ,{ tabIndex: 2 });
     this.nav.setRoot(SchoolMapPage);
  }
 listenEvents() {
    this.events.subscribe('school:mappage', (data) => {
     
     
      this.mapParms = data[0];
      this.tabRef.select(1);
      
    });
 }


}
