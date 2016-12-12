import { NavController, NavParams, ActionSheetController, AlertController, ToastController, Platform,Events ,Tabs} from 'ionic-angular';
import { Component,ViewChild} from '@angular/core';
import { MapleRestData } from '../../providers/maple-rest-data/maple-rest-data';
import { MapleConf } from '../../providers/maple-rest-data/maple-config';
import { UserData } from '../../providers/user-data';
import { AuthService } from '../../providers/auth/auth';
import { ShareService } from '../../providers/share';
import { houseInterface, houseModel } from '../../models/houseModel';


//import { HouseDetailMainPage } from './house-detail-main';
import { HouseDetailPage } from '../../pages/house-detail/house-detail';
import { CommunityStatsPage } from './community-stats';
import { HouseDetailMapPage } from './house-detail-map';
import { SimilarHousesPage } from './similar-houses';




@Component({
	selector: 'page-house-detail-tabs',
	templateUrl: 'house-detail-tabs.html'
})
export class HouseDetailTabsPage {
	@ViewChild('houseDetailTabs') detailComponent: Tabs;
	
	public map: any = HouseDetailMapPage;
	//public detail: any = HouseDetailMainPage;
	public detail: any= HouseDetailPage;
	public similar: any = SimilarHousesPage;
	public stats: any = CommunityStatsPage;
	public mls;


	public houseDetailSelectedIndex: number;
	//public parms;
	public mapParms;
	public schoolParms;
	public statsParms;
	public similarParms;
	public isFav = { houseFav: false, routeFav: false };
	public parms = { id: '', list: [], VOWtoken: '' };
	public houseList = { prev: '', next: '', index: 0, total: 0 };
	private houseRestURL;
	public similarHouseList;
	public schoolList;
	public location;

	//private currentMLS;
	public houseM = new houseModel;
	public house: houseInterface;
	public isMore: boolean = true;
	
   //public detailParms = {'houseM':this.houseM,'isFav': this.isFav, 'houseList': {}};
     public detailParms;



	constructor(
		private nav: NavController,
		private navParams: NavParams,
		private events: Events,
		private mapleRestData: MapleRestData,
		public mapleConf: MapleConf,
		private userData: UserData,
		private alertc: AlertController,
		public auth: AuthService,
		private toastCtrl: ToastController,
		public platform: Platform,
		private shareService: ShareService,
		private actionSheetCtrl: ActionSheetController,
	) {
		this.houseDetailSelectedIndex = 0;
		console.log("house detail tab page is pushed");
		this.parms = navParams.data;
		this.mls = this.parms.id;
		console.log(this.parms);
		this.detailParms = navParams.data;
		this.listenEvents();
	


	}

	ionViewDidLoad() { //load only once


		console.log("House Detail Tabs page view will enter")
		console.log(this.parms)
		this.mapleConf.load().then(data => {
		
			this.getResult(data.houseDetailRest, this.parms.id);
			this.houseRestURL = data.mapHouseRest;
		})

		if (this.mapleConf.helpFlag.houseDetail == false && this.parms.list.length > 1) {
			this.userData.presentToast("提示：左右滑动切换上一个和下一个房源");
			this.mapleConf.helpFlag.houseDetail = true;
		}

		console.log(this.detailComponent.getActiveChildNav);

	
	}

	listenEvents() {
		// this.events.subscribe('housedetail:mlschange', (data) => {
		// console.log(data);
		
		// });	


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
								this.mapleConf.mapDirection(this.houseM.house.latitude, this.houseM.house.longitude);
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




	getResult(url, id) {

		this.parms.id = id;
		let username = (this.auth.authenticated()) ? this.auth.user['email'] : 'NO';
		let token = this.parms.VOWtoken;
		this.mapleRestData.load(url, { 'id': id, 'username': username, 'VOWtoken': token }).subscribe(
			data => {


				this.houseM.rxPhone = this.mapleConf.data.phone;

				this.houseM.house = data.house;
				this.houseM.houseMname = data.house_mname;
				this.houseM.houseProvince = data.house_province;

				this.houseM.housePropertyType = data.house_propertyType;
				this.houseM.exchangeRate = data.exchangeRate;
				this.houseM.cdnPhotos = data.cdn_photos;
				this.isFav = data.isFav; //check if houseFav and routeFav
				this.setHouseList();

				this.location = { 'lat': this.houseM.house.latitude, 'lng': this.houseM.house.longitude, 'type': 1 }; // 2 for school marker
				
				this.detailParms = {'houseM':this.houseM,'isFav': this.isFav, 'houseList': this.houseList};
				this.mapParms = { 'mapType': 0, 'center': this.location, 'zoomlevel': 16 };
				// console.log("before set");
			    // this.mapO = ViewChild('houseDetailTabs');
				// console.log(this.mapO);
				// this.mapO.setParms(this.mapParms);
				
				this.schoolParms = { 'mapType': 1, 'center': this.location, 'zoomlevel': 16 };
				this.statsParms = {'houseM': this.houseM};
				this.similarParms = {'houseM': this.houseM};

				this.events.publish('housedetail:mlschange', {'mapParms':this.mapParms,'schooParms':this.schoolParms,'houseM':this.houseM});
				
				



			}
		)
	}

	getmapParms(){
	
		return this.mapParms;
	}

	getschoolParms(){
		return this.schoolParms;
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


	go2PrevHouse() {
		if (this.houseList.prev)
			this.getResult(this.mapleConf.data.houseDetailRest, this.houseList.prev);
	}

	go2NextHouse() {
		if (this.houseList.next)
			this.getResult(this.mapleConf.data.houseDetailRest, this.houseList.next);
	}

	







}

