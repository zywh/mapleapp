import {Page, NavParams} from 'ionic-angular';
import {AboutPage} from '../about/about';
import {MapSearchPage} from '../map-search/map-search';
import {ProjectsPage} from '../projects/projects';
import {StatsPage} from '../stats/stats';
import {SchoolSearchPage} from '../school-search/school-search';
import {HomePage} from '../home/home';
//import {MapleConf} from './providers/maple-rest-data/maple-config';


@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  // set the root pages for each tab
  home: any = HomePage;
  map: any = MapSearchPage;
  project: any = ProjectsPage;
  school: any = SchoolSearchPage;
  stats: any = StatsPage;
  about: any = AboutPage;
  mySelectedIndex: number;



  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }
}
