//import {Page, NavController} from 'ionic-angular';
import {Page, NavController, NavParams, Events} from 'ionic-angular';
import {OnInit, Component} from '@angular/core';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {Http, Headers, RequestOptions} from '@angular/http';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
import {ProjectDetailPage} from '../project-detail/project-detail';
import {HouseDetailPage} from '../house-detail/house-detail';
import {PostPage} from '../post/post';

@Component({
  templateUrl: 'build/pages/home/home.html',
  // directives: [MapleFooter]
})
export class HomePage implements OnInit {
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


  constructor(
    private nav: NavController,
    private parms: NavParams,
    private mapleRestData: MapleRestData,
    private mapleconf: MapleConf,
    private events: Events
  ) { }

  projectSwiperOptions = {
    loop: true,
    //pager: true,
    speed: 4000,
    autoplay: 300
  };

  ngOnInit() {
    this.mapleconf.load().then(data => {
      //this.postListRest = data.postRest;
      this.houseRestURL = data.mapHouseRest;
      this.getProjects(data.projectRest);
      this.getPosts(data.postListRest, 6);


    })
    this.mapleconf.getLocation().then(data => {
      this.data =data;
    })

  }
  searchHouse(s) {
     console.log("Button is clicked for house search");
     let range: number = 0.015;
     //parm for recommendation
     if ( s == 'recommend'){
       
       range = 0.1;
        
     }
    // this.mapleconf.getLocation().then(data => {
     
      let swLat = this.data['lat'] - range;
      let swLng = this.data['lng'] - range;
      let neLat = this.data['lat'] + range;
      let neLng = this.data['lng'] + range;
      let bounds = swLat + "," + swLng + "," + neLat + "," + neLng;
      let mapParms = {
      
        bounds: bounds,
        type: s,
        sr: 'Sale'
     	};
    
     

        this.mapleRestData.load(this.houseRestURL, mapParms).subscribe(
          data => {
            console.log(data);
            if (data.Data.Type == 'house'){
              this.imgHost = data.Data.imgHost;
              this.nearbyHouseList = data.Data.MapHouseList;
            }
          })

     

    //})
    //end of getLication

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

  sGetItems(searchbar) {

    this.resetItems();
    this.currentDiv = 'sSearchlist';

    if (this.sQueryText == '') {
      return;
    } else {
      let parm = { term: this.sQueryText };
      //Call REST and generate item object
      this.mapleRestData.load('index.php?r=ngget/getSchoolAutoComplete', parm).subscribe(
        data => {
          if (data.hasOwnProperty("CITY")) {
            this.scityItems = data.CITY;

          };

          if (data.hasOwnProperty("SCHOOL")) {
            this.schoolItems = data.SCHOOL;

          }

        }); //end of callback
      //this.items = ["city", "address", "MLS"];
    }
  }

  itemTapped(item, type) {

    let center = new google.maps.LatLng(item.lat, item.lng);
    if (type == 1) {
      this.events.publish('map:center', center);

    }
    if (type == 2) {
      this.events.publish('schoolmap:center', center);
      console.log(item.lat + ":" + item.lng)
    }

    this.resetItems();


  }
  //auto complete REST CAll
  hGetItems(searchbar) {

    this.resetItems();
    this.currentDiv = 'hSearchlist';


    if (this.hQueryText == '') {
      return;
    } else {
      let parm = { term: this.hQueryText };
      //Call REST and generate item object
      this.mapleRestData.load('index.php?r=ngget/getCityList', parm).subscribe(
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
    }
  }


}

