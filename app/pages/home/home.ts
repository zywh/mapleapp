//import {Page, NavController} from 'ionic-angular';
import {Page, NavController, NavParams, Events} from 'ionic-angular';
import {OnInit, Component} from '@angular/core';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {Http, Headers, RequestOptions} from '@angular/http';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
import {ProjectDetailPage} from '../project-detail/project-detail';
import {HouseDetailPage} from '../house-detail/house-detail';
import {UserData} from '../../providers/user-data';
import {PostPage} from '../post/post';
import {ProfilePage} from '../profile/profile';
import {AuthService} from '../../providers/auth/auth';
import {HouseList} from '../../components/house-list/house-list';
import {Search} from '../../components/search/search';

@Component({
  //selector: 'house-list',
  templateUrl: 'build/pages/home/home.html',
  directives: [HouseList, Search]
})
export class HomePage {
  private projects: Object;
  private postListRest;
  private projectRest;
  private post1;
  private favList;
  private hQueryText: String = '';
  private sQueryText: String = '';
  private cityItems: any;
  private addressItems: any;
  private mlsItems: any;
  private currentDiv;
  private scityItems;
  private schoolItems;
  private homeSegment: string = "house1";
  private isAndroid: boolean = false;
  private nearbyHouseList;
  private recommendHouseList;
  private imgHost;
  private houseRestURL;
  private data;
  private listHouse: Boolean = false;
  private listFav: Boolean = true;


  constructor(
    private nav: NavController,
    private parms: NavParams,
    private mapleRestData: MapleRestData,
    private userData: UserData,
    private mapleConf: MapleConf,
    private auth: AuthService,
    private events: Events
  ) {

  }

  projectSwiperOptions = {
    loop: true,
    //pager: true,
    speed: 4000,
    autoplay: 300
  };



  fav() {

    if (this.auth.authenticated()) {
      this.userData.getUserData('houseFav').then(res => {
        this.imgHost = res.imgHost;
        this.favList = res.HouseList;
        //console.log(this.favList);

      });
    } else {
      this.userData.loginAlert();
    }


  }
  profile() {
    this.nav.push(ProfilePage);
  }


  // ngOnInit() {
  ionViewWillEnter() {

    this.mapleConf.load().then(data => {
      //this.postListRest = data.postRest;
      this.houseRestURL = data.mapHouseRest;
      this.projectRest = data.projectRest;

      //this.getProjects();
      // this.getPosts(data.postListRest, 6);
      this.searchHouse('nearby');


    })



  }
  getPostList() {
    this.mapleConf.getLocation().then(data => {
      this.data = data;
    })
    this.mapleConf.load().then(data => {
      //this.postListRest = data.postRest;
      this.houseRestURL = data.mapHouseRest;
     // this.getProjects(data.projectRest);
     // this.getPosts(data.postListRest, 6);


    })
  }

  searchHouse(s) {
    console.log("Button is clicked for house search");
    let range: number = (s == 'recommend') ? 0.1 : 0.015;


    this.mapleConf.getLocation().then(data => {
      this.data = data;
      let swLat = this.data['lat'] - range;
      let swLng = this.data['lng'] - range;
      let neLat = this.data['lat'] + range;
      let neLng = this.data['lng'] + range;
      let bounds = swLat + "," + swLng + "," + neLat + "," + neLng;
      let mapParms = {

        bounds: bounds,
        centerLat: this.data['lat'],
        centerLng: this.data['lng'],
        type: s,
        sr: 'Sale'
      };

      // this.mapleRestData.load(this.houseRestURL, mapParms).subscribe(
      this.mapleRestData.load(this.houseRestURL, mapParms).subscribe(
        data => {
          console.log(data);
          if (data.Data.Type == 'house') {
            this.imgHost = data.Data.imgHost;
            this.nearbyHouseList = data.Data.HouseList;
          }
        })

    })
  }


  gotoHouseDetail(mls, list) {
    this.nav.push(HouseDetailPage, { id: mls, list: list });
  }
  getProjects() {
    this.mapleRestData.load(this.projectRest, this.parms).subscribe(
      data => { this.projects = data; 
        console.log("get projects");
        console.log(data);
      } );

  }

  getPosts(url, catId) {
    this.mapleRestData.load(url, { id: catId }).subscribe(
      data => { this.post1 = data.posts; }
    );

  }
  goToProject(id) {
    this.nav.push(ProjectDetailPage, id);
  }

  goToPost(id) {
    this.nav.push(PostPage, id);
  }

  resetItems() {
    this.cityItems = [];
    this.addressItems = [];
    this.mlsItems = [];
    this.scityItems = [];
    this.schoolItems = [];
    //this.searchQuery = '';
  }

  searchSelection(e) {
    console.log(e);
    if (e.type == 'CITY') {
     this.events.publish('map:center', { lat: e.lat, lng: e.lng });

    } else {
      this.nav.push(HouseDetailPage, { id: e.id });
    }


  }





}

