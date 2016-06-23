//import {Page, NavController} from 'ionic-angular';
import {Page, NavController, NavParams} from 'ionic-angular';
import {OnInit, Component} from '@angular/core';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {Http, Headers, RequestOptions} from '@angular/http';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
import {ProjectDetailPage} from '../project-detail/project-detail';
import {PostPage} from '../post/post';
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
  private postListRest;
  private post1;
  

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

  ngOnInit() {
    this.mapleconf.load().then(data => {
      
      //this.getProjects('index.php?r=ngget/getProjects');
      this.postListRest = data.postRest;
      this.getProjects(data.projectRest);
      this.getPosts(data.postListRest, 12);
     
    })
  }

  getProjects(url) {
    this.mapleRestData.load(url, this.parms).subscribe(
      data => { this.projects = data;  }
    );

  }

  getPosts(url, catId) {
    this.mapleRestData.load(url, { id: catId }).subscribe(
      data => { this.post1 = data.posts;  }
    );

  }
  goToProject(id) {
    this.nav.push(ProjectDetailPage, id);
  }

  goToPost(id) {
    this.nav.push(PostPage, id);
  }

}

