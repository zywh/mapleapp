import {Page, NavController, NavParams,Platform} from 'ionic-angular';
import {OnInit} from 'angular2/core';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
//import {MAPLECONF} from '../../providers/maple-rest-data/maple-config';

@Page({
  templateUrl: 'build/pages/project-detail/project-detail.html'
})
export class ProjectDetailPage implements OnInit {
  private nav;
  private parms: Object;
  private section: string = "summary";
  private isAndroid: boolean = false;
  private project = {
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

  constructor(nav, private navParams: NavParams, private mapleRestData: MapleRestData,platform: Platform) {
    this.nav = nav;
    this.parms = { 'id': navParams.data };
     //this.isAndroid = platform.is('android');

  }
  swiperOptions = {
    loop: true,
    //pager: true,
    speed: 4000,
    autoplay: 300
  };

  ngOnInit() {
    this.getResult('index.php?r=ngget/getProjects');
  }

  getResult(url) {
    this.mapleRestData.load(url, this.parms).subscribe(
      data => { this.project = data; console.log(this.project) }

    )
  }
  converto2a(val) {
    // let img = Array.from(val)
    // let imgsmall;
    // for (var key in img) {
    //   if (img.hasOwnProperty(key)) {
    //     let file = img[key]['file'].replace('uploads',this.project.replaceurl);
    //     imgsmall[key]['file'] = file;
    //     //console.log("FileName:" + file);

    //   }
    // }

    return Array.from(val);
    //return imgsmall;
  }

  smallImg(img) {
    return img.replace('uploads', this.project.replaceurl);
  }



}