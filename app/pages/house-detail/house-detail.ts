import {Page, NavController, NavParams,Platform} from 'ionic-angular';
import {OnInit,Component} from '@angular/core';;
//import {Geolocation} from 'ionic-native';
import {SocialSharing} from 'ionic-native';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
import {SchoolSearchPage} from '../../pages/school-search/school-search';

/*
  Generated class for the HouseDetailPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/house-detail/house-detail.html',
})
export class HouseDetailPage implements OnInit {
  private nav;
  private parms: Object;
  private section: string = "summary";
  private isAndroid: boolean = false;
  private switchF2M: Boolean = true; //"英尺"
	private rooms: Array<Object> = [];
	private house_mname: any;
	private house_propertyType: any;
	private photos: Array<string>;
	private exchangeRate: number;
  private house = {
			id: '',  // => 'ID',
			name: '', // => '名称',
			prepay: '', // => '首付',
			total_price: '', // => '总价',
			subject_id: '', // => '所属项目',
			accessDate: '', // => '挂牌时间',
			location: '', // => '地址',
			introduction: '', // => '描述',
			house_image: '', // => '房源图片',
			image_list: '', // => '组图',
			video_url: '', // => '房源视频路径',
			author: '', // => '作者',
			recommend: '', // => '是否推荐',
			city_id: '', // => '城市',
			district_id: '', // => '地区',
			community: '', // => '社区',
			investType_id: '', // => '投资类型',
			propertyType_id: '', // => '物业类型',
			land_area: '', // => '土地面积',
			house_area: '', // => '房屋面积',
			floor_num: '', // => '房屋层数',
			house_style: '', // => '房屋层数',
			bedroom_num: '', // => '卧室数量',
			toilet_num: '', // => '卫生间数量',
			kitchen_num: '', // => '厨房数量',
			park_num: '', // => '停车位数量',
			house_size: '', // => '房屋规格',
			door_direction: '', // => '大门朝向',
			construction_year: '', // => '建造年份',
			zipcode: '', // => '邮编',
			certificate: '', // => '认证房源',
			lift: '', // => '电梯',
			carport: '', // => '车库',
			embassy: '', // => '会客厅',
			mls_code: '', // => 'MLS编号',
			facilities: '', // => '附近设施',
			longitude: '', // => '经度',
			latitude: '', // => '纬度',
			match: '', // => '配套设施',
			is_sell: '', // => '是否售卖',
			a_c: '', // => '是否中央空调',
			central_vac: '', // => '是否中央吸尘',
			gar_spaces: '', // => '是否配套家具',
			basement: '', // => '是否地下室',
			pool: '', // => '是否游泳池',
			fireplace_stove: '', // => '是否壁炉',
			taxes: '', // => '地税',
			tax_year: '', // => '地税年度',
			cross_streets: '', // => '交叉路口',
			heat: '', // => '暖气',
			mls_province: '', // => 'mls省份',
			mls_area: '', // => 'mls地区',
			mls_area_code: '', // => 'mls地区code',
			mls_municipality: '', // => 'mls城市',
			mls_municp_code: '', // => 'mls城市code',
			yr_built: '', // => 'Yr Built',
			sqft: '', // => 'Sqft',
			area: '', // => 'Area',
			area_code: '', // => 'Area Code',
			bsmt1_out: '', // => 'Bsmt1 Out',
			bsmt2_out: '', // => 'Bsmt2 Out',
			br: '', // => 'Br',
			br_plus: '', // => 'Br Plus',
			community_c: '', // => 'Community C',
			cross_st: '', // => 'Cross St',
			elevator: '', // => 'Elevator',
			constr1_out: '', // => 'Constr1 Out',
			constr2_out: '', // => 'Constr2 Out',
			extras: '', // => 'Extras',
			fpl_num: '', // => 'Fpl Num',
			comp_pts: '', // => 'Comp Pts',
			furnished: '', // => 'Furnished',
			fuel: '', // => 'Fuel',
			heating: '', // => 'Heating',
			num_kit: '', // => 'Num Kit',
			kit_plus: '', // => 'Kit Plus',
			level1: '', // => 'Level1',
			level10: '', // => 'Level10',
			level11: '', // => 'Level11',
			level12: '', // => 'Level12',
			level2: '', // => 'Level2',
			level3: '', // => 'Level3',
			level4: '', // => 'Level4',
			level5: '', // => 'Level5',
			level6: '', // => 'Level6',
			level7: '', // => 'Level7',
			level8: '', // => 'Level8',
			level9: '', // => 'Level9',
			lp_dol: '', // => 'Lp Dol',
			depth: '', // => 'Depth',
			front_ft: '', // => 'Front Ft',
			lotsz_code: '', // => 'Lotsz Code',
			ml_num: '', // => 'Ml Num',
			municipality: '', // => 'Municipality',
			municipality_code: '', // => 'Municipality Code',
			pix_updt: '', // => 'Pix Updt',
			zip: '', // => 'Zip',
			prop_feat1_out: '', // => 'Prop Feat1 Out',
			prop_feat2_out: '', // => 'Prop Feat2 Out',
			prop_feat3_out: '', // => 'Prop Feat3 Out',
			prop_feat4_out: '', // => 'Prop Feat4 Out',
			prop_feat5_out: '', // => 'Prop Feat5 Out',
			prop_feat6_out: '', // => 'Prop Feat6 Out',
			county: '', // => 'County',
			ad_text: '', // => 'Ad Text',
			rm1_out: '', // => 'Rm1 Out',
			rm1_dc1_out: '', // => 'Rm1 Dc1 Out',
			rm1_dc2_out: '', // => 'Rm1 Dc2 Out',
			rm1_dc3_out: '', // => 'Rm1 Dc3 Out',
			rm1_len: '', // => 'Rm1 Len',
			rm1_wth: '', // => 'Rm1 Wth',
			rm10_out: '', // => 'Rm10 Out',
			rm10_dc1_out: '', // => 'Rm10 Dc1 Out',
			rm10_dc2_out: '', // => 'Rm10 Dc2 Out',
			rm10_dc3_out: '', // => 'Rm10 Dc3 Out',
			rm10_wth: '', // => 'Rm10 Wth',
			rm11_out: '', // => 'Rm11 Out',
			rm11_dc1_out: '', // => 'Rm11 Dc1 Out',
			rm11_dc2_out: '', // => 'Rm11 Dc2 Out',
			rm11_dc3_out: '', // => 'Rm11 Dc3 Out',
			rm10_len: '', // => 'Rm10 Len',
			rm11_len: '', // => 'Rm11 Len',
			rm11_wth: '', // => 'Rm11 Wth',
			rm12_out: '', // => 'Rm12 Out',
			rm12_dc1_out: '', // => 'Rm12 Dc1 Out',
			rm12_dc3_out: '', // => 'Rm12 Dc3 Out',
			rm12_len: '', // => 'Rm12 Len',
			rm12_wth: '', // => 'Rm12 Wth',
			rm2_out: '', // => 'Rm2 Out',
			rm2_dc1_out: '', // => 'Rm2 Dc1 Out',
			rm2_dc2_out: '', // => 'Rm2 Dc2 Out',
			rm2_dc3_out: '', // => 'Rm2 Dc3 Out',
			rm2_len: '', // => 'Rm2 Len',
			rm2_wth: '', // => 'Rm2 Wth',
			rm3_out: '', // => 'Rm3 Out',
			rm3_dc1_out: '', // => 'Rm3 Dc1 Out',
			rm3_dc2_out: '', // => 'Rm3 Dc2 Out',
			rm3_len: '', // => 'Rm3 Len',
			rm3_wth: '', // => 'Rm3 Wth',
			rm4_out: '', // => 'Rm4 Out',
			rm4_dc1_out: '', // => 'Rm4 Dc1 Out',
			rm4_dc2_out: '', // => 'Rm4 Dc2 Out',
			rm4_dc3_out: '', // => 'Rm4 Dc3 Out',
			rm4_len: '', // => 'Rm4 Len',
			rm4_wth: '', // => 'Rm4 Wth',
			rm5_out: '', // => 'Rm5 Out',
			rm5_dc1_out: '', // => 'Rm5 Dc1 Out',
			rm5_dc2_out: '', // => 'Rm5 Dc2 Out',
			rm5_dc3_out: '', // => 'Rm5 Dc3 Out',
			rm5_len: '', // => 'Rm5 Len',
			rm5_wth: '', // => 'Rm5 Wth',
			rm6_out: '', // => 'Rm6 Out',
			rm6_dc1_out: '', // => 'Rm6 Dc1 Out',
			rm6_dc2_out: '', // => 'Rm6 Dc2 Out',
			rm6_dc3_out: '', // => 'Rm6 Dc3 Out',
			rm6_len: '', // => 'Rm6 Len',
			rm6_wth: '', // => 'Rm6 Wth',
			rm7_out: '', // => 'Rm7 Out',
			rm7_dc1_out: '', // => 'Rm7 Dc1 Out',
			rm7_dc2_out: '', // => 'Rm7 Dc2 Out',
			rm7_dc3_out: '', // => 'Rm7 Dc3 Out',
			rm7_len: '', // => 'Rm7 Len',
			rm7_wth: '', // => 'Rm7 Wth',
			rm8_out: '', // => 'Rm8 Out',
			rm8_dc1_out: '', // => 'Rm8 Dc1 Out',
			rm8_dc2_out: '', // => 'Rm8 Dc2 Out',
			rm8_dc3_out: '', // => 'Rm8 Dc3 Out',
			rm8_len: '', // => 'Rm8 Len',
			rm8_wth: '', // => 'Rm8 Wth',
			rm9_out: '', // => 'Rm9 Out',
			rm9_dc1_out: '', // => 'Rm9 Dc1 Out',
			rm9_dc2_out: '', // => 'Rm9 Dc2 Out',
			rm9_dc3_out: '', // => 'Rm9 Dc3 Out',
			rm9_len: '', // => 'Rm9 Len',
			rm9_wth: '', // => 'Rm9 Wth',
			rms: '', // => 'Rms',
			rooms_plus: '', // => 'Rooms Plus',
			s_r: '', // => 'S R',
			style: '', // => 'Style',
			yr: '', // => 'Yr',
			type_own1_out: '', // => 'Type Own1 Out',
			tour_url: '', // => 'Tour Url',
			bath_tot: '', // => 'Bath Tot',
			addr: '', // => 'Addr',
			community_code: '', // => 'Community Code',
			rm12_dc2_out: '', // => 'Rm12 Dc2 Out',
			rm3_dc3_out: '', // => 'Rm3 Dc3 Out',
			acres: '', // => 'Acres',
      };


  static get parameters() {
    return [[NavController], [NavParams], [MapleRestData], [MapleConf]];
  }

  constructor(nav, private navParams: NavParams, private mapleRestData: MapleRestData, private mapleConf: MapleConf, 
	private platform: Platform) {
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

  private COMP_PTS = {"N":"北","S":"南","W":"西","E":"东"};
  private S_R = {"Sale":"出售","Lease":"出租"};
	private F2M = {sfeet:"平方英尺", smeter:"平方米"};
	private houseDetailRest: string;

  ngOnInit() {
this.mapleConf.load().then(data => {
    //this.getResult('index.php?r=ngget/getHouseDetail');
		this.getResult(data.houseDetailRest);
    })		
  }

  getResult(url) {
    this.mapleRestData.load(url, this.parms).subscribe(
      data => { 
				//console.log(data);
				this.house = data.house;
				this.house_mname = data.house_mname; 
				this.house_propertyType = data.house_propertyType; 
				this.exchangeRate = data.exchangeRate; 
				this.photos = data.photos; 
				this.houseRooms(this.house);}
    )
  }
  
	round1(num) {    
    return +(Math.round(+(num + "e+1"))  + "e-1");
}

	houseRooms(h) {
		this.rooms[0] = {level:h.level1, out:h.rm1_out, len:h.rm1_len, wth:h.rm1_wth, area:this.round1(h.rm1_len*h.rm1_wth), desc:this.getRoomDesc(h.rm1_dc1_out,h.rm1_dc2_out,h.rm1_dc3_out)};
		this.rooms[1] = {level:h.level2, out:h.rm2_out, len:h.rm2_len, wth:h.rm2_wth, area:this.round1(h.rm2_len*h.rm2_wth), desc:this.getRoomDesc(h.rm2_dc1_out,h.rm2_dc2_out,h.rm2_dc3_out)};
		this.rooms[2] = {level:h.level3, out:h.rm3_out, len:h.rm3_len, wth:h.rm3_wth, area:this.round1(h.rm3_len*h.rm3_wth), desc:this.getRoomDesc(h.rm3_dc1_out,h.rm3_dc2_out,h.rm3_dc3_out)};
		this.rooms[3] = {level:h.level4, out:h.rm4_out, len:h.rm4_len, wth:h.rm4_wth, area:this.round1(h.rm4_len*h.rm4_wth), desc:this.getRoomDesc(h.rm4_dc1_out,h.rm4_dc2_out,h.rm4_dc3_out)};
		this.rooms[4] = {level:h.level5, out:h.rm5_out, len:h.rm5_len, wth:h.rm5_wth, area:this.round1(h.rm5_len*h.rm5_wth), desc:this.getRoomDesc(h.rm5_dc1_out,h.rm5_dc2_out,h.rm5_dc3_out)};
		this.rooms[5] = {level:h.level6, out:h.rm6_out, len:h.rm6_len, wth:h.rm6_wth, area:this.round1(h.rm6_len*h.rm6_wth), desc:this.getRoomDesc(h.rm6_dc1_out,h.rm6_dc2_out,h.rm6_dc3_out)};
		this.rooms[6] = {level:h.level7, out:h.rm7_out, len:h.rm7_len, wth:h.rm7_wth, area:this.round1(h.rm7_len*h.rm7_wth), desc:this.getRoomDesc(h.rm7_dc1_out,h.rm7_dc2_out,h.rm7_dc3_out)};
		this.rooms[7] = {level:h.level8, out:h.rm8_out, len:h.rm8_len, wth:h.rm8_wth, area:this.round1(h.rm8_len*h.rm8_wth), desc:this.getRoomDesc(h.rm8_dc1_out,h.rm8_dc2_out,h.rm8_dc3_out)};
		this.rooms[8] = {level:h.level9, out:h.rm9_out, len:h.rm9_len, wth:h.rm9_wth, area:this.round1(h.rm9_len*h.rm9_wth), desc:this.getRoomDesc(h.rm9_dc1_out,h.rm9_dc2_out,h.rm9_dc3_out)};
		this.rooms[9] = {level:h.level10, out:h.rm10_out, len:h.rm10_len, wth:h.rm10_wth, area:this.round1(h.rm10_len*h.rm10_wth), desc:this.getRoomDesc(h.rm10_dc1_out,h.rm10_dc2_out,h.rm10_dc3_out)};
		this.rooms[10] = {level:h.level11, out:h.rm11_out, len:h.rm11_len, wth:h.rm11_wth, area:this.round1(h.rm11_len*h.rm11_wth), desc:this.getRoomDesc(h.rm11_dc1_out,h.rm11_dc2_out,h.rm11_dc3_out)};
		this.rooms[11] = {level:h.level12, out:h.rm12_out, len:h.rm12_len, wth:h.rm12_wth, area:this.round1(h.rm12_len*h.rm12_wth), desc:this.getRoomDesc(h.rm12_dc1_out,h.rm12_dc2_out,h.rm12_dc3_out)};
}

  getPriceTxt() {
    let priceTxt;
		if ( this.house.s_r == "Sale")
      priceTxt = Number(this.house.lp_dol)/10000 + "万加币";
    else
      priceTxt = this.house.lp_dol + "加元/月";
		return priceTxt;
  }

	getPriceRMB() {
		return parseFloat(this.house.lp_dol) * this.exchangeRate/10000;
	}

  getPropertyTxt() {
      let propertyTxt = this.house.prop_feat1_out;
      
      if ( this.house.prop_feat2_out )
        propertyTxt = propertyTxt + " , " + this.house.prop_feat2_out;
      if ( this.house.prop_feat3_out )
        propertyTxt = propertyTxt + " , " + this.house.prop_feat3_out;
      if ( this.house.prop_feat4_out )
        propertyTxt = propertyTxt + " , " + this.house.prop_feat4_out;
      if ( this.house.prop_feat5_out )
        propertyTxt = propertyTxt + " , " + this.house.prop_feat5_out;
      if ( this.house.prop_feat6_out )
        propertyTxt = propertyTxt + " , " + this.house.prop_feat6_out;
      
      return propertyTxt;
  }

  getRoomDesc(dc1, dc2, dc3) {
      let roomDesc = dc1;
      
      if ( dc2 ) roomDesc = roomDesc + " , " + dc2;
      if ( dc3)  roomDesc = roomDesc + " , " + dc3;
     
      return roomDesc;
   }

	getLandArea(f2m, area) {
			if (f2m)
				return this.round1(parseFloat(this.house.land_area) * 0.09290304) + this.F2M.smeter;
			else 
				return this.house.land_area + this.F2M.sfeet;
	}

  gotoSchool() {
    this.nav.push(SchoolSearchPage);
  }

  gotoVideo() {
    window.open(this.house.video_url);
  }

	photoUrl(photo) {
		return this.mapleConf.data.picHost + photo;
	}

  go2PreHouse() {
    //console.log("PreHouse" + this.preHouse);
    //this.getResult(this.mapleConf.data.houseDetailRest, this.preHouse);
  }

  go2NextHouse() {
    //console.log("NextHouse" + this.nextHouse);
    //this.getResult(this.mapleConf.data.houseDetailRest, this.nextHouse)
  }

   share(message, subject, file, link) {
       // this.platform.ready().then(() => {
            //window.plugins.socialsharing.share(message, subject, file, link);
            SocialSharing.share(message, subject, file, link);
           
       // });
    }
 
    shareViaTwitter(message, image, link) {
        // this.platform.ready().then(() => {
        //     if(window.plugins.socialsharing) {
        //         window.plugins.socialsharing.canShareVia("twitter", message, null, image, link, function(result) {
        //             window.plugins.socialsharing.shareViaTwitter(message, image, link);
        //         }, function(error) {
        //             console.error(error);
        //         });
        //     }
        // });
    }



}