//import {Page, NavController} from 'ionic-angular';
import {Page, NavController, NavParams} from 'ionic-angular';
import {OnInit} from '@angular/core';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {Http, Headers, RequestOptions} from '@angular/http';
//import {MAPLECONF} from '../../providers/maple-rest-data/maple-config';

import {ProjectDetailPage} from '../project-detail/project-detail';
import {MapleFooter} from '../maple-footer/maple-footer';

/*
  Generated class for the HomePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/home/home.html',
  directives: [MapleFooter]
})
export class HomePage implements OnInit {
  private nav;
  private parms = {};
  projects: Object;

  static get parameters() {
    return [[NavController], [NavParams], [MapleRestData]];
  }

  constructor(nav, navParams, private mapleRestData: MapleRestData) {
    this.nav = nav;

  }
  
  projectSwiperOptions = {
     loop: true,
     //pager: true,
     speed: 4000,
     autoplay: 300
  };


  ngOnInit() {
    this.getProjects('index.php?r=ngget/getProjects');
  }

  getProjects(url) {
    this.mapleRestData.load(url, this.parms).subscribe(
      data => { this.projects = data; console.log(this.projects); }
    );

  }
  goToProject( id ) {
    this.nav.push(ProjectDetailPage, id);
  }

}

