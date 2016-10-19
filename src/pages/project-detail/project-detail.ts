import {NavController, NavParams, Platform} from 'ionic-angular';
import {OnInit, Component} from '@angular/core';;
import {SocialSharing} from 'ionic-native';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
import {UserData} from '../../providers/user-data';
declare var Wechat: any;
//declare var WeChat: any; //tx-wechat

@Component({
  templateUrl: 'project-detail.html'
})
export class ProjectDetailPage implements OnInit {

  public parms: Object;
  public section: string = "summary";
  public isAndroid: boolean = false;
  public project = {
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

  // static get parameters() {
  //   return [[NavController], [NavParams], [MapleRestData]];
  // }

  constructor(
    private navParams: NavParams,
    private mapleRestData: MapleRestData,
    private mapleconf: MapleConf,
    public userData: UserData,
    private platform: Platform
  ) {

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

    this.mapleconf.load().then(data => {
      this.getResult(data.projectRest);

    })
  }

  getResult(url) {
    this.mapleRestData.load(url, this.parms).subscribe(
      data => {
        this.project = data;

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

    let link = "http://m.maplecity.com.cn/index.php?r=projects/more&id=" + this.project.id;
    let img = this.project.room_type_image.replace('uploads', this.project.replaceurl);

    this.userData.share(link,img,this.project.name,this.project.summary);



  }




}