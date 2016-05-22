import {Page, NavController, NavParams} from 'ionic-angular';
import {OnInit} from 'angular2/core';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {MAPLECONF} from '../../providers/maple-rest-data/maple-config';

@Page({
  templateUrl: 'build/pages/project-detail/project-detail.html'
})
export class ProjectDetailPage implements OnInit {
  private nav;
  private parms: Object;
  project = {
    id: '',
    name: '',
    image_list: {},
    summary: '',
    amenities: '',
    point: '',
    developer_intro: '',
    layout_list: {},
    cityname: '',
    replaceurl: ''
  };

  static get parameters() {
    return [[NavController], [NavParams], [MapleRestData]];
  }

  constructor(nav, private navParams: NavParams, private mapleRestData: MapleRestData) {
    this.nav = nav;
    this.parms = { 'id': navParams.data };

  }


  ngOnInit() {
    this.getResult('index.php?r=ngget/getProjects');
  }

  getResult(url) {
    this.mapleRestData.load(url, this.parms).subscribe(
      data => { this.project = data; console.log(this.project) }

    )
  }
  converto2a(val) {
    return Array.from(val);
  }



}