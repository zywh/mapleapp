//import {Page, NavController} from 'ionic-angular';
import { NavController, NavParams, Events } from 'ionic-angular';
import { Component } from '@angular/core';
import { MapleRestData } from '../../providers/maple-rest-data/maple-rest-data';
import { MapleConf } from '../../providers/maple-rest-data/maple-config';
import { ProjectDetailPage } from '../project-detail/project-detail';
import { HouseDetailPage } from '../house-detail/house-detail';
import { UserData } from '../../providers/user-data';
import { PostPage } from '../post/post';
import { ProfilePage } from '../profile/profile';
import { AuthService } from '../../providers/auth/auth';
//import { HouseList } from '../../components/house-list/house-list';
//import { Search } from '../../components/search/search';
import {houseListModel} from '../../models/houseListModel';

@Component({
  templateUrl: 'home.html'
})
export class HomePage {
  public projects: Object;
  public postListRest;
  public projectRest;
  public VOWTokenRest;
  public post1;
  public favList;
  public hQueryText: string = '';
  public sQueryText: string = '';
  public cityItems: any;
  public addressItems: any;
  public mlsItems: any;
  public currentDiv;
  public scityItems;
  public schoolItems;
  public homeSegment: string = "house1";
  public isAndroid: boolean = false;
  public nearbyHouseList: houseListModel;
  public recommendHouseList;
  public imgHost;
  public houseRestURL;
  public data;
  public listHouse: boolean = false;
  public listFav: boolean = true;
  //public houseListM;


  constructor(
    private nav: NavController,
    private parms: NavParams,
    private mapleRestData: MapleRestData,
    private userData: UserData,
    private mapleConf: MapleConf,
    private auth: AuthService,
    private events: Events
  ) {
    this.listenEvents();
  }

  projectSwiperOptions = {
    loop: true,
    //pager: true,
    speed: 4000,
    autoplay: 300
  };


  listenEvents() {
    this.events.subscribe('user:login', () => {
      console.log("user login event detected")
      setTimeout(() => {this.setVOWtoken(this.VOWTokenRest);}, 600);     
    });

    this.events.subscribe('user:logout', () => {
      console.log("user logout event detected")
      setTimeout(() => {this.setVOWtoken(this.VOWTokenRest);}, 600);     
    });
  }


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


  ngOnInit() {
    // ionViewWillEnter() {

    this.mapleConf.load().then(data => {
      //this.postListRest = data.postRest;
      this.houseRestURL = data.mapHouseRest;
      this.projectRest = data.projectRest;
      this.VOWTokenRest = data.getVOWTokenRest;

      //this.getProjects();
      // this.getPosts(data.postListRest, 6);
      this.setVOWtoken(this.VOWTokenRest);
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
    let range: number = (s == 'recommend') ? 0.1 : 0.05;


    this.mapleConf.getLocation().then(data => {
      this.data = data;
      let swLat = this.data['lat'] - range;
      let swLng = this.data['lng'] - range;
      let neLat = this.data['lat'] + range;
      let neLng = this.data['lng'] + range;
      let bounds = swLat + "," + swLng + "," + neLat + "," + neLng;
      let mapParms = {
        centerLat: this.data['lat'],
        centerLng: this.data['lng'],
        bounds: bounds,
        type: s,
        sr: 'Sale'
      };

      // this.mapleRestData.load(this.houseRestURL, mapParms).subscribe(
      this.mapleRestData.load(this.houseRestURL, mapParms).subscribe(
        data => {
          console.log(data);
          if (data.Data.Type == 'house') {
            this.imgHost = data.Data.imgHost;
            //this.nearbyHouseList = data.Data.HouseList;
            //this.nearbyHouseList = this.setVowMask(data.Data.HouseList);
            this.nearbyHouseList = new houseListModel(data.Data.HouseList,this.auth.authenticated());
           // this.nearbyHouseList.setVowMask(this.auth.authenticated());
            
            console.log(this.nearbyHouseList);

          }
        })

    })
  }


  getProjects() {
    this.mapleRestData.load(this.projectRest, this.parms).subscribe(
      data => {
        this.projects = data;
        console.log("get projects");
        console.log(data);
      });

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


  searchSelection(e) {
   
    if (e != 'INFOCUS') {
      if (e.type == 'CITY') {
    
        this.events.publish('map:center', { type:'HOUSE',lat: e.lat, lng: e.lng });
        this.userData.saveCenter('recentCenter', e.id, e.lat, e.lng);

      } else {
        this.nav.push(HouseDetailPage, { id: e.id });
      }

    }



  }

	setVOWtoken(url) {
		this.mapleRestData.load(url, '').subscribe(
			token => {
          this.mapleConf.setVOWtoken(token);
			}
		)
	}


}

