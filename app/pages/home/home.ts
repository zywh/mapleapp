//import {Page, NavController} from 'ionic-angular';
import {Page, NavController, NavParams} from 'ionic-angular';
import {OnInit, Component} from '@angular/core';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {Http, Headers, RequestOptions} from '@angular/http';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
import {ProjectDetailPage} from '../project-detail/project-detail';
import {PostPage} from '../post/post';
import {MapleFooter} from '../maple-footer/maple-footer';
//import {RangeKnob,Range} from '../ion-range/range';


/*
  Generated class for the HomePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/home/home.html',
  // directives: [MapleFooter]
})
export class HomePage implements OnInit {
  //private nav;
  // private parms = {};
  private projects: Object;
  private postListRest;
  private post1;
  private hQueryText: String = '';
  private sQueryText: String = '';
  private cityItems: any;
  private addressItems: any;
  private mlsItems: any;
  private currentDiv;
  

  constructor(
    private nav: NavController,
    private parms: NavParams,
    private mapleRestData: MapleRestData,
    private mapleconf: MapleConf
  ) {
    //this.nav = nav;

  }

  projectSwiperOptions = {
    loop: true,
    //pager: true,
    speed: 4000,
    autoplay: 300
  };

  ngOnInit() {
    this.mapleconf.load().then(data => {
      
      //this.getProjects('index.php?r=ngget/getProjects');
      this.postListRest = data.postRest;
      this.getProjects(data.projectRest);
      this.getPosts(data.postListRest, 12);
     
    })
  }

  getProjects(url) {
    this.mapleRestData.load(url, this.parms).subscribe(
      data => { this.projects = data;  }
    );

  }

  getPosts(url, catId) {
    this.mapleRestData.load(url, { id: catId }).subscribe(
      data => { this.post1 = data.posts;  }
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
    //this.searchQuery = '';
  }


  itemTapped(event, item, type) {
    if (type == 1) { //CITY Action
      let lat = item.lat;
      let lng = item.lng;
      let center = new google.maps.LatLng(lat, lng);
      //this.setLocation(center, 14);
      this.resetItems();
    }

    if (type == 2) { //MLS Action
      // this.nav.push(HouseDetailPage, {
      //   item: item.id //pass MLS# to house detail
      // });
    }

    if (type == 3) { //Address Action
      // this.nav.push(HouseDetailPage, {
      //   item: item.id //pass MLS# to house detail
      // });
    }

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

