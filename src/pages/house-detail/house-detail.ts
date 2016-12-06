import { Content, NavController, NavParams, AlertController, ToastController, Platform, Slides, Events, ActionSheetController } from 'ionic-angular';
import { Component, ViewChild, ElementRef } from '@angular/core';
//import {Geolocation} from 'ionic-native';
//import { SocialSharing } from 'ionic-native';
import { MapleRestData } from '../../providers/maple-rest-data/maple-rest-data';
import { MapleConf } from '../../providers/maple-rest-data/maple-config';
import { UserData } from '../../providers/user-data';
//import { HouseCityStatsPage } from '../../pages/house-city-stats/house-city-stats';
import { AuthService } from '../../providers/auth/auth';
import { ShareService } from '../../providers/share';
import { houseInterface, houseModel } from '../../models/houseModel';
import { houseListModel } from '../../models/houseListModel';
//import { HouselistSearch } from '../houselist-search/houselist-search';
import { MapSearchPage } from '../map-search/map-search';
import { MapSearchNewPage } from '../map-search-new/map-search-new';

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
	public parms = { id: '', list: [], VOWtoken: '' };
	public houseList = { prev: '', next: '', index: 0, total: 0 };
	public section: string = "housedetail";
	public isAndroid: boolean = false;
	public switchF2M: boolean = true; //"Meter"
	public rooms: Array<Object> = [];
	public house_mname: any;
	public house_propertyType: any;
	//public photos: Array<string>;
	//public cdn_photos: Array<string>;
	public exchangeRate: number;
	public username: string;
	public houseM = new houseModel;
	public house: houseInterface;
	public rx_phone: string;
	public COMP_PTS = { "N": "北", "S": "南", "W": "西", "E": "东" };
	public S_R = { "Sale": "出售", "Lease": "出租" };
	public F2M = { feet: "尺", meter: "米", sfeet: "平方英尺", smeter: "平方米" };
	private houseRestURL;
	public similarHouseList;
	public schoolList;
	tabBarElement: any;
	@ViewChild(Content) content: Content;
	//showToolbar: boolean = false;
	private lockRefresh = { 'school': false, 'similar': false, 'community': false };//Lock tab page refresh
	//public location = { 'lat': 44, 'lng': -79 };
	public location;
	public schoolPushPage = MapSearchNewPage;
	//public schoolPushPage = MapSearchPage;
	//public schoolPushParams = {'pageType': 1};
	public schoolPushParams ;

	@ViewChild('photo_slider') slider: Slides;
	public popLock: boolean = false;
	private currentMLS;

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
		this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
		this.listenEvents();
		//this.house = this.houseM.house;




	}


	listenEvents() {
		this.events.subscribe('toast:dismiss', () => {
			console.log("Toast dismiss event received")
			this.isMore = true;
		});
		this.events.subscribe('user:login', (data) => {
			// no need after directly jump to auth.login - hu
			//this.nav.pop(); //dismiss once login page is presented
			console.log('housedetail user:login detected ' + this.houseM.house.src);


			setTimeout(() => {
				if (!this.houseM.house.src) this.getResult(this.mapleConf.data.houseDetailRest, this.parms.id);
			}, 600);
		});



	}

	ionViewWillEnter() {


		console.log("House Detail page view did enter")
		console.log(this.parms)
		this.mapleConf.load().then(data => {
			//this.getResult('index.php?r=ngget/getHouseDetail');
			this.getResult(data.houseDetailRest, this.parms.id);
			this.houseRestURL = data.mapHouseRest;
		})

		if (this.mapleConf.helpHouseDetailFlag == false && this.parms.list.length > 1) {
			this.userData.presentToast("提示：左右滑动切换上一个和下一个房源");
			this.mapleConf.helpHouseDetailFlag = true;
		}

	}

	ionViewWillLeave() {
		this.tabBarElement.style.display = 'flex';
	}

	ionViewDidEnter() {
		this.tabBarElement.style.display = 'none';
		this.content.resize();
	}

	ionViewCanLeave() {
		console.log("Should I leave?" + this.popLock); //prevent swipe to leave page and tigger tab bar back to detail page
		return this.popLock;
	}

	unlockPop() {
		this.popLock = true;
		this.nav.pop();
	}

	pop2first() {
		this.popLock = true;
		this.nav.setRoot(this.nav.first());
	}
	gotoMap(){
		this.popLock = true;
		this.location = { 'lat': this.houseM.house.latitude, 'lng': this.houseM.house.longitude };
		//this.nav.push(MapSearchNewPage,this.location);
		this.nav.push(MapSearchNewPage,{'mapType': 1,'center':this.location});

	}

	similar() {
		//this.houseM.house.lp_dol = '';
		this.popLock = true;
		if (this.lockRefresh.similar == false) {
		//if (this.currentMLS != this.houseM.house.ml_num) {
			//let similarHouses;
			let range: number = 0.1;


			let swLat = this.houseM.house.latitude - range;
			let swLng = this.houseM.house.longitude - range;
			let neLat = this.houseM.house.latitude + range;
			let neLng = this.houseM.house.longitude + range;
			let bounds = swLat + "," + swLng + "," + neLat + "," + neLng;
			let housePrice = { lower: this.houseM.house.lp_dol * 0.8 / 10000, upper: this.houseM.house.lp_dol * 1.2 / 10000 };
			//let houseArea;
			if (this.houseM.house.house_area > 100) {
				//houseArea = { lower: this.houseM.house.house_area * 0.8, upper: this.houseM.house.house_area * 1.2 };
			}


			//let landArea = {};
			if (this.houseM.house.land_area > 1000) {
				//landArea = { lower: this.houseM.house.land_area * 0.8, upper: this.houseM.house.land_area * 1.2 };
			}



			let mapParms = {
				bounds: bounds,
				housetype: [this.houseM.house.propertyType_id],
				sr: this.houseM.house.s_r,
				houseprice: housePrice,
				//houseroom: this.houseM.house.br,
				//housearea: houseArea,
				//houseground: landArea
				type: 'nearby',
				//housebaths: this.houseM.house.bath_tot
			}

			// this.mapleRestData.load(this.houseRestURL, mapParms).subscribe(
			this.mapleRestData.load(this.houseRestURL, mapParms).subscribe(
				data => {
					console.log(data);


					if (data.Data.Type == 'house') {
						//similarHouses = new houseListModel(data.Data.HouseList, this.auth.authenticated());
						this.similarHouseList = new houseListModel(data.Data.HouseList, this.auth.authenticated());
						//console.log(similarHouses);
						//this.nav.push(HouselistSearch, { list: similarHouses, imgHost: '', listType: 'house' });
						this.lockRefresh.similar = true;
						this.currentMLS = this.houseM.house.ml_num;

					}
				})

		}
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
						text: '地图导航',
						handler: () => {
							actionSheet.dismiss().then(res => {
								this.mapDirection();
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
		this.userData.favWrapper(this.houseM.house.ml_num, type).then(res => {
			console.log(this.houseM.house.ml_num + "Return:" + res);
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

	swipeEvent(e) {
		if (e.direction == 2) {
			//direction 2 = right to left swipe.
			console.log("Swipe event right to left");
			this.go2NextHouse();

		} else if (e.direction == 4) {
			console.log("Swipe event left to right");
			this.go2PrevHouse();
		}

	}


	getResult(url, id) {

		this.parms.id = id;
		let username = (this.auth.authenticated()) ? this.auth.user['email'] : 'NO';
		let token = this.parms.VOWtoken;
		this.mapleRestData.load(url, { 'id': id, 'username': username, 'VOWtoken': token }).subscribe(
			data => {

				this.lockRefresh = { 'school': false, 'similar': false, 'community': false };//Lock tab page refresh
			
				if (this.section == "similar") {
					console.log("Refresh similar house list");
					this.similar();

				}
				if (this.section == "school") {
					this.gotoSchool();

				}
				this.houseM.rxPhone = this.mapleConf.data.phone;
			
				this.houseM.house = data.house;
				this.houseM.houseMname = data.house_mname;
				this.houseM.houseProvince = data.house_province;
				//console.log(this.houseM.houseProvince);
				this.house_propertyType = data.house_propertyType;
				this.houseM.housePropertyType = data.house_propertyType;
				this.houseM.exchangeRate = data.exchangeRate;
				this.houseM.cdnPhotos = data.cdn_photos;
				this.isFav = data.isFav; //check if houseFav and routeFav
				this.setHouseList();
				this.houseM.setProperties(this.auth.authenticated(), this.switchF2M);
				this.location = { 'lat': this.houseM.house.latitude, 'lng': this.houseM.house.longitude };

				this.slider.slideTo(0);

				//this.initMap();
			
				this.section = 'housedetail';

				//call similar if selected


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
			console.log("HOUSE LIST for PRE and NEXT");
			console.log(this.houseList);
		}
	}


	gotoCityStats() {
		//this.section = "housedetail";
		//this.nav.push(HouseCityStatsPage, this.houseM.house.municipality);

		//this.auth.authenticated();
	}
	gotoSchool() {
		//this.nav.push(SchoolSearchPage);
		// let navTransition = this.nav.pop();
		// navTransition.then(() => {
		// 	//let center = new google.maps.LatLng(this.houseM.house.latitude, this.houseM.house.longitude);
		// 	//this.events.publish('schoolmap:center', center);
		// 	this.events.publish('schoolmap:center', { lat: this.houseM.house.latitude, lng: this.houseM.house.longitude, type: 'HOUSE' });
		// }
		// )
		//this.events.publish('schoolmap:center', { lat: this.houseM.house.latitude, lng: this.houseM.house.longitude, type: 'HOUSE' });
		if (this.lockRefresh.school == false) {


			let range = 0.03;
			let _sw_lat = this.houseM.house.latitude - range;
			let _sw_lng = this.houseM.house.longitude - range;
			let _ne_lat = this.houseM.house.latitude + range;
			let _ne_lng = this.houseM.house.longitude + range;
			let _bounds = _sw_lat + "," + _sw_lng + "," + _ne_lat + "," + _ne_lng;
			let mapParms = { bounds: _bounds };
			this.mapleConf.load().then(data => {

				let restUrl = data.getSchoolmapDataRest;

				this.mapleRestData.load(restUrl, mapParms).subscribe(
					data => {
						console.log(data);
						this.schoolList = data.SchoolList;
						this.lockRefresh.school = true;
					}
				);
			});
		}

	}


	go2PrevHouse() {
		if (this.houseList.prev)
			this.getResult(this.mapleConf.data.houseDetailRest, this.houseList.prev);
	}

	go2NextHouse() {
		if (this.houseList.next)
			this.getResult(this.mapleConf.data.houseDetailRest, this.houseList.next);
	}



	mapDirection() {
		this.mapleConf.mapDirection(this.houseM.house.latitude, this.houseM.house.longitude)
	}

	share() {

		let subject = "枫之都房产：" + this.parms.id;
		let message = this.houseM.getPriceTxt(this.houseM.house.lp_dol) + " - " + this.houseM.getAddr() + " " + this.houseM.house.municipality;
		let img = this.houseM.cdnPhotos[0];
		//let link = "http://m.maplecity.com.cn/index.php?r=mhouse/view&id=" + this.parms.id;
		let link = this.mapleConf.data.mcihost + "/#/housedetail/" + this.parms.id;
		if (this.houseM.house.src == 'VOW') link = link + "/" + this.mapleConf.VOWtoken;
		console.log("wechat link -" + link);
		this.shareService.share(link, img, subject, message);
	}
}