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
import { houseInterface, houseModel } from '../../models/houseModel';
import { houseListModel } from '../../models/houseListModel';
import { HouselistSearch } from '../houselist-search/houselist-search';

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
	public parms = { id: '', list: [], VOWtoken:'' };
	public houseList = { prev: '', next: '', index: 0, total: 0 };
	public section: string = "summary";
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
	private VOWtoken: string;


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
		//this.house = this.houseM.house;

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
		slidesPerView: 'auto',
		spaceBetween: 1,
		autoHeight: true,
		pager: true,
		speed: 300,
		autoplay: 3000
	};


	ionViewDidEnter() {
		console.log("House Detail page view did enter")
		this.mapleConf.load().then(data => {
			//this.getResult('index.php?r=ngget/getHouseDetail');
			this.getResult(data.houseDetailRest, this.parms.id);
			this.houseRestURL = data.mapHouseRest;
			if (!this.VOWtoken) {
				this.getVOWtoken(data.getVOWTokenRest);
			} 
		})
	}


	initMap() {

		let point = new google.maps.LatLng(this.houseM.house.latitude, this.houseM.house.longitude);
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

	similar() {
		//this.houseM.house.lp_dol = '';

		let similarHouses;
		let range: number = 0.1;


		let swLat = this.houseM.house.latitude - range;
		let swLng = this.houseM.house.longitude - range;
		let neLat = this.houseM.house.latitude + range;
		let neLng = this.houseM.house.longitude + range;
		let bounds = swLat + "," + swLng + "," + neLat + "," + neLng;
		let housePrice = { lower: this.houseM.house.lp_dol * 0.8 / 10000, upper: this.houseM.house.lp_dol * 1.2 / 10000 };
		let houseArea;
		if (this.houseM.house.house_area > 1) {
			houseArea = { lower: this.houseM.house.house_area * 0.8, upper: this.houseM.house.house_area * 1.2 };
		}


		let landArea = {};
		if (this.houseM.house.land_area > 1000) {
			landArea = { lower: this.houseM.house.land_area * 0.8, upper: this.houseM.house.land_area * 1.2 };
		}



		let mapParms = {
			bounds: bounds,
			housetype: [this.houseM.house.propertyType_id],
			sr: this.houseM.house.s_r,
			houseprice: housePrice,
			houseroom: this.houseM.house.br,
			housearea: houseArea,
			houseground: landArea
		}

		// this.mapleRestData.load(this.houseRestURL, mapParms).subscribe(
		this.mapleRestData.load(this.houseRestURL, mapParms).subscribe(
			data => {
				console.log(data);


				if (data.Data.Type == 'house') {
					similarHouses = new houseListModel(data.Data.HouseList, this.auth.authenticated());
					console.log(similarHouses);
					this.nav.push(HouselistSearch, { list: similarHouses, imgHost: '', listType: 'house' });


				}
			})


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
						text: '类似房源',
						handler: () => {
							actionSheet.dismiss().then(res => {
								this.similar();
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
		console.log("house detail get result")
		this.parms.id = id;
		let username = (this.auth.authenticated()) ? this.auth.user['email'] : 'NO';
		let token = (this.auth.authenticated()) ? '' : this.parms.VOWtoken;
		this.mapleRestData.load(url, { 'id': id, 'username': username, 'VOWtoken': token }).subscribe(
			data => {

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

				this.slider.slideTo(0);
				this.initMap();
			}
		)
	}

	getVOWtoken(url) {
		this.mapleRestData.load(url, '').subscribe(
			token => { 
				this.VOWtoken = token;
				console.log('global VOWtoken:' + this.VOWtoken);
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
		this.nav.push(HouseCityStatsPage, this.houseM.house.municipality);
		this.auth.authenticated();
	}
	gotoSchool() {
		//this.nav.push(SchoolSearchPage);
		let navTransition = this.nav.pop();
		navTransition.then(() => {
			//let center = new google.maps.LatLng(this.houseM.house.latitude, this.houseM.house.longitude);
			//this.events.publish('schoolmap:center', center);
			this.events.publish('schoolmap:center', { lat: this.houseM.house.latitude, lng: this.houseM.house.longitude, type: 'HOUSE' });
		}
		)

	}

	gotoVideo() {
		if (this.houseM.house.tour_url) window.open(this.houseM.house.tour_url, "_blank");
		/*this.platform.ready().then(() => {
				if (this.houseM.house.tour_url) cordova.InAppBrowser.open(this.houseM.house.tour_url, "_system", "location=true");
		})*/
	}

	f2m() {
		this.houseM.getLandArea(this.switchF2M);
		this.houseM.houseRooms(this.switchF2M);
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
		if (this.houseM.house.src == 'VOW') {
			link = link + "/" + this.VOWtoken;
		}
		this.shareService.share(link, img, subject, message);
	}
}