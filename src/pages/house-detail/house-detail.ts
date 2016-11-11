import { NavController, NavParams, AlertController, ToastController, Platform, Slides, Events, ActionSheetController } from 'ionic-angular';
import { OnInit, Component, ViewChild, ElementRef } from '@angular/core';
//import {Geolocation} from 'ionic-native';
import { SocialSharing } from 'ionic-native';
import { MapleRestData } from '../../providers/maple-rest-data/maple-rest-data';
import { MapleConf } from '../../providers/maple-rest-data/maple-config';
import { UserData } from '../../providers/user-data';
import { HouseCityStatsPage } from '../../pages/house-city-stats/house-city-stats';
import { AuthService } from '../../providers/auth/auth';
import { ShareService } from '../../providers/share';
import { houseInterface, houseModel } from '../../models/houseModel'
declare var google: any;

/*
  Generated class for the HouseDetailPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
	templateUrl: 'house-detail.html',
})
export class HouseDetailPage {
	@ViewChild('maphouse') mapElement: ElementRef;

	public isFav = { houseFav: false, routeFav: false };
	public isMore: Boolean = true; //more buttom will be disabled before toast is dismiss
	public parms = { id: '', list: [] };
	public houseList = { prev: '', next: '', index: 0, total: 0 };
	public section: string = "summary";
	public isAndroid: boolean = false;
	public switchF2M: Boolean = true; //"英尺"
	public rooms: Array<Object> = [];
	public house_mname: any;
	public house_propertyType: any;
	public photos: Array<string>;
	public cdn_photos: Array<string>;
	public exchangeRate: number;
	public username: string;
	public house: houseInterface;
	public rx_phone: string;
	public COMP_PTS = { "N": "北", "S": "南", "W": "西", "E": "东" };
	public S_R = { "Sale": "出售", "Lease": "出租" };
	public F2M = { feet: "尺", meter: "米", sfeet: "平方英尺", smeter: "平方米" };


	@ViewChild('photo_slider') slider: Slides;

	constructor(
		public nav: NavController,
		private navParams: NavParams,
		private mapleRestData: MapleRestData,
		public mapleConf: MapleConf,
		private events: Events,
		private userData: UserData,
		private alertc: AlertController,
		public auth: AuthService,
		private toastCtrl: ToastController,
		private actionSheetCtrl: ActionSheetController,
		public platform: Platform,
		private shareService: ShareService) {

		//this.nav = nav;
		console.log(navParams);
		this.parms = navParams.data;
		this.listenEvents();
		//this.username = this.auth.user['email'];//testing user
		//this.isAndroid = platform.is('android');

	}

	listenEvents() {
		this.events.subscribe('toast:dismiss', () => {
			console.log("Toast dismiss event received")
			this.isMore = true;
		});

		this.events.subscribe('profile:login', (data) => {
			this.nav.pop(); //dismiss once login page is presented
		})

	}

	swiperOptions = {
		//loop: true,
		autoHeight: true,
		pager: true,
		speed: 300,
		autoplay: 3000
	};


	ionViewDidEnter() {
		this.mapleConf.load().then(data => {
			//this.getResult('index.php?r=ngget/getHouseDetail');
			this.getResult(data.houseDetailRest, this.parms.id);
		})
	}


	initMap() {

		let point = new google.maps.LatLng(this.house.latitude, this.house.longitude);
		let mapOptions = {
			//center: latLng,
			center: point,
			minZoom: 4,
			zoom: 14,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}
		let map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
		let markerDrop = new google.maps.Marker({
			position: point,
			map: map,
			animation: google.maps.Animation.DROP,
			draggable: false,
		});


	}

	more() {
		//this.userData.hasFavorite(this.parms.id).then(res => {
		//this.isFav = res;
		if (this.auth.authenticated()) {


			console.log(this.isFav);
			let s1 = (!this.isFav.houseFav) ? '添加收藏列表' : '删除收藏列表';
			let s2 = (!this.isFav.routeFav) ? '添加看房列表' : '删除看房列表';


			let actionSheet = this.actionSheetCtrl.create({
				title: '房源更多功能',
				buttons: [
					{
						text: s1,
						role: 'destructive',
						handler: () => {
							actionSheet.dismiss().then(res => {
								this.fav('houseFav');
								this.isMore = false; //lock more button
							})

						}
					},
					{
						text: s2,
						handler: () => {
							actionSheet.dismiss().then(res => {
								this.fav('routeFav');
								this.isMore = false;
							})

						}
					},
					{
						text: '取消',
						role: 'cancel',
						handler: () => {

							console.log('Cancel clicked');
						}
					}
				]
			});

			actionSheet.present();
			//})
		} else {
			this.userData.loginAlert();
		}
	}


	fav(type) {
		//type = 0 for houseFav and 1 for RouteFav
		this.userData.favWrapper(this.house.ml_num, type).then(res => {
			console.log(this.house.ml_num + "Return:" + res);
			switch (res) {
				case 'C': //mls doesn't exist .Add MLS into fav'
					if (type == 'houseFav') { this.isFav.houseFav = true; }
					if (type == 'routeFav') { this.isFav.routeFav = true; }
					break;
				case 'D': //mls exist . Remove MLS from fav
					if (type == 'houseFav') { this.isFav.houseFav = false; }
					if (type == 'routeFav') { this.isFav.routeFav = false; }
					break;
				default:
					console.log("Add fav is aborted");
			}

		})




	}

	getResult(url, id) {
		
		this.parms.id = id;
		let username = (this.auth.authenticated()) ? this.auth.user['email'] : 'NO';
		this.mapleRestData.load(url, { 'id': id, 'username': username }).subscribe(
			data => {
				//console.log(data);
				this.rx_phone = this.mapleConf.data.phone;
				this.house = data.house;
				this.house_mname = data.house_mname;
				this.house_propertyType = data.house_propertyType;
				this.exchangeRate = data.exchangeRate;
				this.photos = data.photos;
				this.cdn_photos = data.cdn_photos;
				this.houseRooms(this.house);
				this.isFav = data.isFav; //check if houseFav and routeFav
				this.setHouseList();
				console.log(this.isFav);
				//console.log(this.slider); 
				this.slider.slideTo(0);
				this.initMap();
			}
		)
	}

	setHouseList() {
		this.houseList = { prev: null, next: null, index: 0, total: 0 };
		if (this.parms.list) {
			let ids = this.parms.list.map(e => e.MLS);
			let pos = ids.indexOf(this.parms.id);

			this.houseList.index = pos;
			this.houseList.prev = (pos > 0) ? ids[pos - 1] : null;
			this.houseList.next = (pos < ids.length - 1) ? ids[pos + 1] : null;
			this.houseList.total = ids.length;
			console.log(this.houseList);
		}
	}

	add2(int1, int2) {
		return parseInt(int1, 10) + parseInt(int2, 10);
	}

	round1(num) {
		return +(Math.round(+(num + "e+1")) + "e-1");
	}

	round2(num) {
		return +(Math.round(+(num + "e+2")) + "e-2");
	}

	houseRooms(h) {
		this.rooms[0] = { level: h.level1, out: h.rm1_out, len: h.rm1_len, wth: h.rm1_wth, area: this.round1(h.rm1_len * h.rm1_wth), desc: this.getRoomDesc(h.rm1_dc1_out, h.rm1_dc2_out, h.rm1_dc3_out) };
		this.rooms[1] = { level: h.level2, out: h.rm2_out, len: h.rm2_len, wth: h.rm2_wth, area: this.round1(h.rm2_len * h.rm2_wth), desc: this.getRoomDesc(h.rm2_dc1_out, h.rm2_dc2_out, h.rm2_dc3_out) };
		this.rooms[2] = { level: h.level3, out: h.rm3_out, len: h.rm3_len, wth: h.rm3_wth, area: this.round1(h.rm3_len * h.rm3_wth), desc: this.getRoomDesc(h.rm3_dc1_out, h.rm3_dc2_out, h.rm3_dc3_out) };
		this.rooms[3] = { level: h.level4, out: h.rm4_out, len: h.rm4_len, wth: h.rm4_wth, area: this.round1(h.rm4_len * h.rm4_wth), desc: this.getRoomDesc(h.rm4_dc1_out, h.rm4_dc2_out, h.rm4_dc3_out) };
		this.rooms[4] = { level: h.level5, out: h.rm5_out, len: h.rm5_len, wth: h.rm5_wth, area: this.round1(h.rm5_len * h.rm5_wth), desc: this.getRoomDesc(h.rm5_dc1_out, h.rm5_dc2_out, h.rm5_dc3_out) };
		this.rooms[5] = { level: h.level6, out: h.rm6_out, len: h.rm6_len, wth: h.rm6_wth, area: this.round1(h.rm6_len * h.rm6_wth), desc: this.getRoomDesc(h.rm6_dc1_out, h.rm6_dc2_out, h.rm6_dc3_out) };
		this.rooms[6] = { level: h.level7, out: h.rm7_out, len: h.rm7_len, wth: h.rm7_wth, area: this.round1(h.rm7_len * h.rm7_wth), desc: this.getRoomDesc(h.rm7_dc1_out, h.rm7_dc2_out, h.rm7_dc3_out) };
		this.rooms[7] = { level: h.level8, out: h.rm8_out, len: h.rm8_len, wth: h.rm8_wth, area: this.round1(h.rm8_len * h.rm8_wth), desc: this.getRoomDesc(h.rm8_dc1_out, h.rm8_dc2_out, h.rm8_dc3_out) };
		this.rooms[8] = { level: h.level9, out: h.rm9_out, len: h.rm9_len, wth: h.rm9_wth, area: this.round1(h.rm9_len * h.rm9_wth), desc: this.getRoomDesc(h.rm9_dc1_out, h.rm9_dc2_out, h.rm9_dc3_out) };
		this.rooms[9] = { level: h.level10, out: h.rm10_out, len: h.rm10_len, wth: h.rm10_wth, area: this.round1(h.rm10_len * h.rm10_wth), desc: this.getRoomDesc(h.rm10_dc1_out, h.rm10_dc2_out, h.rm10_dc3_out) };
		this.rooms[10] = { level: h.level11, out: h.rm11_out, len: h.rm11_len, wth: h.rm11_wth, area: this.round1(h.rm11_len * h.rm11_wth), desc: this.getRoomDesc(h.rm11_dc1_out, h.rm11_dc2_out, h.rm11_dc3_out) };
		this.rooms[11] = { level: h.level12, out: h.rm12_out, len: h.rm12_len, wth: h.rm12_wth, area: this.round1(h.rm12_len * h.rm12_wth), desc: this.getRoomDesc(h.rm12_dc1_out, h.rm12_dc2_out, h.rm12_dc3_out) };
	}

	getPriceTxt(price) {
		let priceTxt;
		if (this.house.s_r == "Sale")
			priceTxt = Number(price) / 10000 + "万加币";
		else
			priceTxt = price + "加元/月";
		return priceTxt;
	}

	getPriceRMB(price) {
		return this.round2(parseFloat(price) * this.exchangeRate / 10000);
	}

	getPropertyTxt() {
		let propertyTxt = this.house.prop_feat1_out;

		if (this.house.prop_feat2_out)
			propertyTxt = propertyTxt + " , " + this.house.prop_feat2_out;
		if (this.house.prop_feat3_out)
			propertyTxt = propertyTxt + " , " + this.house.prop_feat3_out;
		if (this.house.prop_feat4_out)
			propertyTxt = propertyTxt + " , " + this.house.prop_feat4_out;
		if (this.house.prop_feat5_out)
			propertyTxt = propertyTxt + " , " + this.house.prop_feat5_out;
		if (this.house.prop_feat6_out)
			propertyTxt = propertyTxt + " , " + this.house.prop_feat6_out;

		return propertyTxt;
	}

	getRoomDesc(dc1, dc2, dc3) {
		let roomDesc = dc1;

		if (dc2) roomDesc = roomDesc + " , " + dc2;
		if (dc3) roomDesc = roomDesc + " , " + dc3;

		return roomDesc;
	}

	getLandArea() {
		if (this.switchF2M)
			return this.round2(this.house.land_area * 0.09290304) + this.F2M.smeter;
		else
			return this.house.land_area + this.F2M.sfeet;
	}

	getAddr() {
		let txt = this.house.addr;
		if (this.house.apt_num) txt = this.house.apt_num + '-' + this.house.addr;
		return txt;
	}

	hasOpenHouse(oh_dt) {
		if (this.auth.authenticated())
			return (oh_dt && oh_dt != '0000-00-00') ? true : false;
		else
			return false;
	}

	getOpenHouse(oh_dt, oh_from, oh_to) {
		let txt = '';
		if (oh_dt && oh_dt != '0000-00-00') txt = oh_dt + ' ' + oh_from + '-' + oh_to;
		return txt;
	}

	gotoCityStats() {
		this.nav.push(HouseCityStatsPage, this.house.municipality);
	}
	gotoSchool() {
		//this.nav.push(SchoolSearchPage);
		let navTransition = this.nav.pop();
		navTransition.then(() => {
			//let center = new google.maps.LatLng(this.house.latitude, this.house.longitude);
			//this.events.publish('schoolmap:center', center);
			this.events.publish('schoolmap:center', { lat: this.house.latitude, lng: this.house.longitude, type: 'HOUSE' });
		}
		)

	}

	gotoVideo() {
		if (this.house.tour_url) window.open(this.house.tour_url, "_blank");
		/*this.platform.ready().then(() => {
				if (this.house.tour_url) cordova.InAppBrowser.open(this.house.tour_url, "_system", "location=true");
		})*/
	}

	photoUrl(photo) {
		return this.mapleConf.data.picHost + photo;
	}

	go2PrevHouse() {
		if (this.houseList.prev)
			this.getResult(this.mapleConf.data.houseDetailRest, this.houseList.prev);
	}

	go2NextHouse() {
		if (this.houseList.next)
			this.getResult(this.mapleConf.data.houseDetailRest, this.houseList.next);
	}


	openHouseList() {
	}

	mapDirection() {
		this.mapleConf.mapDirection(this.house.latitude, this.house.longitude)
	}

	share() {

		let subject = "枫之都房产：" + this.parms.id;
		let message = this.getPriceTxt(this.house.lp_dol) + " - " + this.getAddr() + " " + this.house.municipality;
		let img = this.cdn_photos[0];
		//let link = "http://m.maplecity.com.cn/index.php?r=mhouse/view&id=" + this.parms.id;
		let link = this.mapleConf.data.mcihost + "/#/housedetail/" + this.parms.id;
		this.shareService.share(link, img, subject, message);
	}
}