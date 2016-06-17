import {Page, NavController, NavParams, Platform} from 'ionic-angular';
import {OnInit, Component} from '@angular/core';;
//import {Geolocation} from 'ionic-native';
import {SocialSharing} from 'ionic-native';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
//import {MAPLECONF} from '../../providers/maple-rest-data/maple-config';
declare var WeChat: any;
declare var Wechat: any; //tx-wechat

@Component({
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
    room_type_image: '',
    replaceurl: ''
  };

  static get parameters() {
    return [[NavController], [NavParams], [MapleRestData]];
  }

  constructor(nav, private navParams: NavParams, private mapleRestData: MapleRestData, private platform: Platform) {
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
      data => {
        this.project = data;
        let link = "http://m.maplecity.com.cn/index.php?r=projects/more&id=" + this.project.id;
        let img = this.project.room_type_image.replace('uploads', this.project.replaceurl);
        console.log(img + ":" + this.project.name + ":" + link);
      }

    )
  }
  converto2a(val) {
    return Array.from(val);
    //return imgsmall;
  }

  smallImg(img) {
    return img.replace('uploads', this.project.replaceurl);
  }


  share() {

    if (typeof Wechat === "undefined") {
      //alert("Wechat plugin is not installed.");
      return false;
    } else {
      // this.platform.ready().then(() => {
      //window.plugins.socialsharing.share(message, subject, file, link);
      //console.log(this.project.room_type_image + ":" + this.project.name)
      let link = "http://m.maplecity.com.cn/index.php?r=projects/more&id=" + this.project.id;
      let img = this.project.room_type_image.replace('uploads', this.project.replaceurl);
      //let link = "http://m.maplecity.com.cn/index.php?r=projects/more&id=" + this.project.id;
      //SocialSharing.share(this.project.summary, this.project.name, img, link);
      // Wechat.share({
      //   message: {
      //     title: this.project.name,
         
      //     description: this.project.summary,
      //     //mediaTagName: "Media Tag Name(optional)",
      //     thumb: img,
      //     media: {
      //       type: Wechat.Type.WEBPAGE,   // webpage
      //       webpageUrl: link    // webpage
      //     }
      //   },
      //   scene: Wechat.Scene.TIMELINE   // share to Timeline
      // }, function () {
      //   alert("Success");
      // }, function (reason) {
      //   alert("Failed: " + reason);
      // });
      WeChat.share({
        type: WeChat.ShareType.webpage,
        title:  this.project.name,
        description: this.project.summary,
        url: link,
        thumbData: img
      }, WeChat.Scene.timeline, function () {
        console.log('分享成功~');
      }, function (reason) {
        // 分享失败
        console.log(reason);
      });

      //wx223b36a9265ba2d5
      //(<any>window).Wechat.whatever();
    }
  }

  share2() {


    // this.platform.ready().then(() => {
    //window.plugins.socialsharing.share(message, subject, file, link);
    //console.log(this.project.room_type_image + ":" + this.project.name)
    let link = "http://m.maplecity.com.cn/index.php?r=projects/more&id=" + this.project.id;
    let img = this.project.room_type_image.replace('uploads', this.project.replaceurl);
    //let link = "http://m.maplecity.com.cn/index.php?r=projects/more&id=" + this.project.id;
    SocialSharing.share(this.project.summary, this.project.name, img, link);

  }



}