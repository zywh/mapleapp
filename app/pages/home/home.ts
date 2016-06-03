//import {Page, NavController} from 'ionic-angular';
import {Page, NavController, NavParams} from 'ionic-angular';
import {OnInit,Component} from '@angular/core';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {Http, Headers, RequestOptions} from '@angular/http';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
import {ProjectDetailPage} from '../project-detail/project-detail';
import {MapleFooter} from '../maple-footer/maple-footer';
//import {RangeKnob,Range} from '../ion-range/range';


/*
  Generated class for the HomePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/home/home.html',
 // directives: [MapleFooter]
})
export class HomePage implements OnInit {
  //private nav;
  // private parms = {};
  projects: Object;

  static get parameters() {
    return [[NavController], [NavParams], [MapleRestData], [MapleConf]];
  }

  constructor(
    private nav: NavController,
    private parms: NavParams,
    private mapleRestData: MapleRestData,
    private mapleconf: MapleConf
  ) {
    //this.nav = nav;

  }

  projectSwiperOptions = {
    loop: true,
    //pager: true,
    speed: 4000,
    autoplay: 300
  };

  brightness: number = 20;
  saturation: number = 0;
  warmth: number = 1300;
  structure: any = {lower: 33, upper: 60};

  onChange(ev) {
    console.log("Changed", ev);
  }

  ngOnInit() {
    this.mapleconf.load().then(data => {
      console.log(data.projectRest);
      //this.getProjects('index.php?r=ngget/getProjects');
      this.getProjects(data.projectRest);
    })
  }

  getProjects(url) {
    this.mapleRestData.load(url, this.parms).subscribe(
      data => { this.projects = data; console.log(this.projects); }
    );

  }
  goToProject(id) {
    this.nav.push(ProjectDetailPage, id);
  }

}

