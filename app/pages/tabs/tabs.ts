import {Page, NavParams} from 'ionic-angular';
import {SchedulePage} from '../schedule/schedule';
import {SpeakerListPage} from '../speaker-list/speaker-list';
import {MapPage} from '../map/map';
import {AboutPage} from '../about/about';
import {MapSearchPage} from '../map-search/map-search';
import {ProjectsPage} from '../projects/projects';
import {SchoolSearchPage} from '../school-search/school-search';
import {HomePage} from '../home/home';
//import {MapleConf} from './providers/maple-rest-data/maple-config';


@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = HomePage;
  tab2Root: any = AboutPage;
  tab3Root: any = ProjectsPage;
  tab4Root: any = SchoolSearchPage;
  mySelectedIndex: number;
  
  

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }
}
