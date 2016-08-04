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

@Component({
  templateUrl: 'build/pages/home/home.html',
  // directives: [MapleFooter]
})
export class HomePage {
  private projects: Object;
  private postListRest;
  private post1;
  private hQueryText: String = '';
  private sQueryText: String = '';
  private cityItems: any;
  private addressItems: any;
  private mlsItems: any;
  private currentDiv;
  private scityItems;
  private schoolItems;
  private homeSegment: string = "info";
  private isAndroid: boolean = false;
  private nearbyHouseList;
  private recommendHouseList;
  private imgHost;
  private houseRestURL;
  private data;
  private favHouses;
  private username;


  constructor(
    private nav: NavController,
    private parms: NavParams,
    private mapleRestData: MapleRestData,
    private userData: UserData,
    private mapleconf: MapleConf,
    private auth: AuthService, 
    private events: Events
  ) { }

  projectSwiperOptions = {
    loop: true,
    //pager: true,
    speed: 4000,
    autoplay: 300
  };
  
  fav(){
    this.userData.getFavHouses(this.username).then(res=>{
      this.favHouses = res;
    
     
    })
    
  }
  profile(){
    this.nav.push(ProfilePage);
  }
 

  // ngOnInit() {
  ionViewWillEnter() {
    this.mapleconf.load().then(data => {
      //this.postListRest = data.postRest;
      this.houseRestURL = data.mapHouseRest;
      this.getProjects(data.projectRest);
      this.getPosts(data.postListRest, 6);


    })
    this.mapleconf.getLocation().then(data => {
      this.data = data;
    })

  }
  searchHouse(s) {
    console.log("Button is clicked for house search");
    let range: number = 0.015;
    //parm for recommendation
    if (s == 'recommend') {

      range = 0.1;

    }
    // this.mapleconf.getLocation().then(data => {
    console.log(this.data);
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



    this.mapleRestData.load(this.houseRestURL, mapParms).subscribe(
      data => {
        console.log(data);
        if (data.Data.Type == 'house') {
          this.imgHost = data.Data.imgHost;
          this.nearbyHouseList = data.Data.MapHouseList;
        }
      })
  }


  gotoHouseDetail(mls, list) {
    this.nav.push(HouseDetailPage, { id: mls, list: list });
  }
  getProjects(url) {
    this.mapleRestData.load(url, this.parms).subscribe(
      data => { this.projects = data; }
    );

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

  // sGetItems(searchbar) {

  //   this.resetItems();
  //   this.currentDiv = 'sSearchlist';

  //   if (this.sQueryText == '') {
  //     return;
  //   } else {
  //     let parm = { term: this.sQueryText };
  //     //Call REST and generate item object
  //     this.mapleRestData.load('index.php?r=ngget/getSchoolAutoComplete', parm).subscribe(
  //       data => {
  //         if (data.hasOwnProperty("CITY")) {
  //           this.scityItems = data.CITY;

  //         };

  //         if (data.hasOwnProperty("SCHOOL")) {
  //           this.schoolItems = data.SCHOOL;

  //         }

  //       }); //end of callback
  //     //this.items = ["city", "address", "MLS"];
  //   }
  // }

  itemTapped(item, type) {

    let center = new google.maps.LatLng(item.lat, item.lng);

    if (type == 1) {
      this.events.publish('map:center', center);
      this.hQueryText == '';
      this.currentDiv = '';

    }
    if (type == 2) {
      this.events.publish('schoolmap:center', center);
      console.log(item.lat + ":" + item.lng)
    }

  }

  searchFocus() {
    this.hQueryText = '';
    this.resetItems();
    this.currentDiv = 'searchlist';


  }

  //auto complete REST CAll
  hGetItems(ev) {

    this.resetItems();
    this.currentDiv = 'hSearchlist';
    let val = ev.target.value;

    if (val && val.trim() != '') {

      //Call REST and generate item object
      this.mapleconf.load().then(data => {
        this.mapleRestData.load(data.getCitylistDataRest, { term: val }).subscribe(
          data => {
            if (data.hasOwnProperty("CITY")) {
              this.cityItems = data.CITY;
              console.log("CITY Autocomplete:" + this.cityItems);
            };

            if (data.hasOwnProperty("MLS")) {
              this.mlsItems = data.MLS;
              console.log("MLS Autocomplete:" + this.mlsItems);
            }
            if (data.hasOwnProperty("ADDRESS")) {
              this.addressItems = data.ADDRESS;
              console.log("ADDRESS Autocomplete:" + this.addressItems);
            }
            console.log(data);
          }); //end of callback
        //this.items = ["city", "address", "MLS"];
      })
    }
  }


  }

