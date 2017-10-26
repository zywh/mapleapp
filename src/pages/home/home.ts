//import {Page, NavController} from 'ionic-angular';
import { NavController, NavParams, Events, Platform } from 'ionic-angular';
import { Component } from '@angular/core';
import { MapleRestData } from '../../providers/maple-rest-data/maple-rest-data';
import { MapleConf } from '../../providers/maple-rest-data/maple-config';
import { ProjectDetailPage } from '../project-detail/project-detail';
import { HouseDetailPage } from '../house-detail/house-detail';
import { UserData } from '../../providers/user-data';
import { PostPage } from '../post/post';
import { ProfilePage } from '../profile/profile';
import { AuthService } from '../../services/auth.service';

//import { HouseList } from '../../components/house-list/house-list';
//import { Search } from '../../components/search/search';
import { houseListModel } from '../../models/houseListModel';

@Component({
  templateUrl: 'home.html'
})
export class HomePage {
  private remoteVersion;
  // private iosURL;
  // private androidURL;
  // private googleURL;
  public projects: Object;
  public postListRest;
  public projectRest;
  public VOWTokenRest;
  public post1;
  public favList;
  public todayList;

  public homeSegment: string = "house1";
  public isAndroid: boolean = false;
  public nearbyHouseList: houseListModel;
  public recommendHouseList: houseListModel;
  public imgHost;
  public houseRestURL;
  private todayListRestURL;
  private data = { 'lat': 0, 'lng': 0 };
  public listHouse: boolean = false;
  public listFav: boolean = true;
  private refreshLock = { 'nearby': false, 'recommend': false, 'projects': false };
  //public houseListM;
  // public inputText: string = '城市/地址/MLS#';


  constructor(
    private nav: NavController,
    private platform: Platform,
    // private alertc: AlertController,
    private parms: NavParams,
    private mapleRestData: MapleRestData,
    private userData: UserData,
    private mapleConf: MapleConf,
    private auth: AuthService,
    private events: Events
  ) {


    this.listenEvents();
  }

  
    getViewType(){
        return this.userData.viewType;
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
      setTimeout(() => { this.setVOWtoken(this.VOWTokenRest); }, 600);
    });

    this.events.subscribe('user:logout', () => {
      console.log("user logout event detected")
      setTimeout(() => { this.setVOWtoken(this.VOWTokenRest); }, 600);
    });
  }


  fav() {

    if (this.auth.isAuthenticated()) {
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
     // console.log(data);
      //this.postListRest = data.postRest;
      this.remoteVersion = data.version;
      this.houseRestURL = data.mapHouseRest;
      this.projectRest = data.projectRest;
      this.todayListRestURL = data.todayListRest;
      this.VOWTokenRest = data.getVOWTokenRest;
      //this.googleURL = data.googleURL;
      // this.iosURL = data.iosURL;
      // this.androidURL = data.androidURL;



      //this.getProjects();
      // this.getPosts(data.postListRest, 6);
      this.setVOWtoken(this.VOWTokenRest);
      this.searchHouse('nearby');

      //  if (this.remoteVersion != this.mapleConf.localVersion){
      //    this.upgradeAlert(this.remoteVersion);
      //  }


    })



  }

  // ionViewWillEnter() {
  //   console.log("Home Page will enter");
  //   console.log(this.remoteVersion + "LocalVersion:" + this.mapleConf.localVersion);
  //   if ( this.remoteVersion != this.mapleConf.localVersion){
  //     console.log("Upgrade alert");
  //   }

  // }
  today() {

    let user = this.auth.isAuthenticated()? this.auth.user['email']: "NO";
    this.mapleRestData.load(this.todayListRestURL, { username: user }).subscribe(
      data => {
        console.log("today rest");
       
        this.imgHost = data.Data.imgHost;
        this.todayList = new houseListModel(data.Data.HouseList, this.auth.isAuthenticated());
         console.log(this.todayList);
      })


  }


  getPostList() {
    // this.mapleConf.getLocation().then(data => {
    //   this.data = data;
    // })
    this.mapleConf.load().then(data => {
      //this.postListRest = data.postRest;
      this.houseRestURL = data.mapHouseRest;
      // this.getProjects(data.projectRest);
      // this.getPosts(data.postListRest, 6);


    })
  }

  refresh() {
    if (this.homeSegment == 'house1')
      this.searchHouse('nearby');
    if (this.homeSegment == 'house2')
      this.searchHouse('recommend');
    if (this.homeSegment == 'projects')
      this.getProjects();



  }

  searchHouse(s) {
    console.log("Button is clicked for house search");
    let range: number = (s == 'recommend') ? 0.1 : 0.05;


    this.mapleConf.getLocation().then(data => {
      console.log(data);
      console.log(this.data);
      let locationChange: boolean = (this.data.lat.toFixed(3) != data['lat'].toFixed(3)) || (this.data.lng.toFixed(3) != data['lng'].toFixed(3))
      if (locationChange) {
        this.refreshLock = { 'nearby': false, 'recommend': false, 'projects': false };
      }
      let runGetHouse: boolean = (s == 'nearby') ? this.refreshLock.nearby : this.refreshLock.recommend;
      if (!runGetHouse) {
        this.data.lat = data['lat'];
        this.data.lng = data['lng'];
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


              if (s == 'nearby') {
                this.nearbyHouseList = new houseListModel(data.Data.HouseList, this.auth.isAuthenticated());
                this.refreshLock.nearby = true;
              }
              if (s == 'recommend') {
                this.recommendHouseList = new houseListModel(data.Data.HouseList, this.auth.isAuthenticated());
                this.refreshLock.recommend = true;
              }
              // this.nearbyHouseList = new houseListModel(data.Data.HouseList, this.auth.authenticated());


            }
          })
      }
    })
  }


  getProjects() {

    if (this.refreshLock.projects == false) {


      this.mapleRestData.load(this.projectRest, this.parms).subscribe(
        data => {
          this.projects = data;
          console.log("get projects");
          this.refreshLock.projects = true;

        });
    }
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

        this.events.publish('map:center', { type: 'HOUSE', lat: e.lat, lng: e.lng });
        this.userData.saveCenter('recentCenter', e.id, e.lat, e.lng);

      } else {
        this.nav.push(HouseDetailPage, { id: e.id, list: [] });
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

