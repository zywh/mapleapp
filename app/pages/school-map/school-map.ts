import {Modal, Loading,Tabs, Alert, ActionSheet, Events, MenuController, Platform, NavController, NavParams, Page, ViewController} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
//import {AngularRange} from 'angular-ranger';
//import {RichMarker} from 'rich-marker'; It doesn't provide TS definition. Use ext URL to include in index.html
import { NgZone, Component, ViewChild} from '@angular/core';;
import {MapSearchPage} from '../map-search/map-search';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';

import {SelectOptionModal} from './schoolmap-option-modal';
import {ConferenceData} from '../../providers/conference-data';
import {TabsPage} from '../tabs/tabs';
declare var RichMarker: any;

interface schoolSelectOptionsObj {
  selectType?: Boolean,
  selectRank?: Number,
  selectPingfen?: Number,
  selectXingzhi?: String
}

/*
  Generated class for the MapSearchPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/school-map/school-map.html',
  //directives: [McSearchOption]
})


export class SchoolMapPage {
  @ViewChild('mcTabs') tabRef: Tabs;
  private searchQuery: String = '';
  private cityItems: any;
  private schoolItems: any;
  private parms: Object;
  private map;
  private center;
  private markerArray = [];
  //private htmlArray = [];
  private htmlArrayPosition = 0;
  private totalCount: Number; //Returned House
  // private listAllHtml = ''; //hold houses on current map
  // public isListShow: boolean = false;
  private schoolList: Array<any>;
  private markerType;


  private selectSchool: schoolSelectOptionsObj = {
    selectPingfen: 0,
    selectRank: 0,
    selectType: true,
    selectXingzhi: ''

  }

  private currentDiv;

  constructor(
    private nav: NavController,
    private mapleRestData: MapleRestData,
    private confData: ConferenceData,
    private _zone: NgZone,
    private viewCtrl: ViewController,
    private events: Events
  ) {

    this.resetItems();
    this.loadRichMarker(); //Load richmarker after googlemap. Check network connection to avoid blank page

  }


  loadRichMarker(){
     let script = document.createElement("script");
      script.src = "extjs/richmarker.js";
      document.body.appendChild(script);
  }


  optionChange(event) {
    this.currentDiv = '';
    this.selectSchool = event;
    this.changeMap();

  }
  openModal(opt) {
    let modal = Modal.create(SelectOptionModal, { data: opt });
    modal.onDismiss(data => {
      this.selectSchool = data;
      this.changeMap();
    });
    this.nav.present(modal);
  }



  ionViewLoaded() {
    //ngOnInit() {
    let options = { timeout: 10000, enableHighAccuracy: true };

    navigator.geolocation.getCurrentPosition(

      (position) => {

        //let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;

        if (lat > 20) {
          this.loadMap(lat, lng, 14);
        } else {
          let lat: Number = 43.6532;
          let lng: Number = -79.3832;
          this.loadMap(lat, lng, 14);
        }

      },

      (error) => {
        let lat: Number = 43.6532;
        let lng: Number = -79.3832;
        this.loadMap(lat, lng, 14);
        console.log(error);
      }, options

    );
    // let lat: Number = 43.6532;
    // let lng: Number = -79.3832;

    // this.confData.getMap().then(mapData => {  //Need this for werid map issue. Menu page switch will make map blank
    //   this.loadMap(lat, lng, 14);
    // })
    
  }

  ionViewWillEnter() {
    console.log("School Map View will enter");
  }

  ionViewDidEnter() {
    console.log("School Map View did entered");
   // this.changeMap();
   //google.maps.event.trigger(this.map, 'resize');
  }

  gotoHouseMap(lat, lng) {
    let center = { lat: lat, lng: lng }
    this.nav.push(MapSearchPage, center);
  }

  openSchoolList() {
    console.log()


  }

  loadMap(lat, lng, zoom) {

    this.center = new google.maps.LatLng(lat, lng);
    //  let latLng = new google.maps.LatLng(-34.9290, 138.6010);
    //let latLng = new google.maps.LatLng(-34.9290, 138.6010);
    //this.confData.getMap().then(mapData => {
    let mapEle = document.getElementById('schoolmap');

    this.map = new google.maps.Map(mapEle, {
      //center: mapData.find(d => d.center),
      center: this.center,
      minZoom: 9,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_LEFT
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
      },
      scaleControl: true,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT
      },
      zoom: zoom
    });

    //this.listenEvents();
    google.maps.event.addListener(this.map, 'idle', () => {

      this.changeMap();

    });

    google.maps.event.addListener(this.map, 'click', () => {
      this._zone.run(() => {
        this.searchQuery = '';
        this.currentDiv = '';
      });


    });



    //});
  }
  // //select autocomplete action
  // listenEvents() {
  //   this.events.subscribe('tab:schoolmap', () => {
  //     //this.enableMenu(true);
  //     console.log("Event Table schoomap is received");
  //     // this.map.setCenter();
  //     // this.nav.setRoot(SchoolMapPage);
  //     //this.changeMap();
  //   });

  //}
  resetItems() {
    this.cityItems = [];
    //this.addressItems = [];

  }


  itemTapped(event, item, type) {
    if (type == 1) { //CITY Action
      let lat = item.lat;
      let lng = item.lng;
      let center = new google.maps.LatLng(lat, lng);
      this.setLocation(center, 14);
      this.resetItems();
    }

    if (type == 2) { //SCHOOL Action
      let lat = item.lat;
      let lng = item.lng;
      this.nav.push(MapSearchPage, {
        lat: lat,
        lng: lng
      });
    }



  }
  //auto complete REST CAll
  getItems(searchbar) {

    this.resetItems();
    this.currentDiv = 'searchlist';

    // set q to the value of the searchbar
    let q = searchbar.value;

    // if the value is an empty string don't filter the items
    if (q.trim() == '') {
      return;
    } else {
      let parm = { term: q.trim() };
      //Call REST and generate item object
      this.mapleRestData.load('index.php?r=ngget/getSchoolAutoComplete', parm).subscribe(
        data => {
          if (data.hasOwnProperty("CITY")) {
            this.cityItems = data.CITY;

          };

          if (data.hasOwnProperty("SCHOOL")) {
            this.schoolItems = data.SCHOOL;

          }

        }); //end of callback
      //this.items = ["city", "address", "MLS"];
    }
  }
  //SetCenter and Zoom
  setLocation(center, zoom) {
    this.map.setCenter(center);

    this.map.setZoom(zoom);
    let marker = new google.maps.Marker({
      position: center,
      map: this.map,
      draggable: false,

    });
  }


  //set house marker
  // setContent(lat, lng, count, houses, price) {
  setContent(lat, lng, html, rating) {
    let point = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
    let content = this.setMarkerCss(rating);
	   let marker = new RichMarker({
      position: point,
      map: this.map,
      draggable: false,
      content: content,
      flat: true
    });
    this.markerArray.push(marker);
    // var contentString = "fsdafsadfsdafsda";
    // var infowindow = new google.maps.InfoWindow({
    //   content: contentString,
    //   disableAutoPan: true

    // });

    marker.addListener('click', () => {

      let alert = Alert.create({
        title: '学校简介',
        message: html,
        cssClass: 'school_popup',
        buttons: [
          {
            text: '取消',
            role: 'cancel',
           
          },
          {
            text: '周边房源',
            handler: () => {
           
             this.events.publish('school:mappage',{lat: lat,lng: lng}); //public event and trigger tab select and map change
            
            }
          }
        ]
      });
      this.nav.present(alert);
      //   //infowindow.open(this.map, marker);
    });


  }
  //set grid and city marker
  setContentCount(lat, lng, totalCount, city, rating) {
    //let content = "<i class='icon_map_mark'><span>" + totalCount + "</span></i>";
    let point = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
    let content = this.setMarkerCss(rating); //default color
	   let marker = new RichMarker({
      position: point,
      map: this.map,
      draggable: false,
      content: content,
      flat: true
    });


    this.markerArray.push(marker);
    google.maps.event.addListener(marker, 'click', function () {
      this.map.setCenter(this.position);
      let currentzoom = this.map.getZoom();
      this.map.setZoom(currentzoom + 2);
    });


  }
  //clear marker when map changed
  clearAll() {
    if (this.markerArray) {
      for (let i in this.markerArray) {
        this.markerArray[i].setMap(null);
      }
      this.markerArray.length = 0;
    }

    //this.htmlArray = [];
    //this.htmlArrayPosition = 0;

  }

  setMarkerCss(rating) {
    var bg = this.getRating2Scale(rating).bg;
    var font = this.getRating2Scale(rating).font;
    var markercontent = "<i class='common_bg icon_map_mark2' style='background-color:" + bg + ";'><span style='color:" + font + ";'>" + rating + "</span></i>";
    return markercontent;

  }

 	getRating2Scale(rating) {

    let color = {
      bg: '',
      font: ''
    };
    let hueEnd = 130;
    let ratingStep = hueEnd / 10; //Rating is 0-10
    let hue = Math.ceil(ratingStep * rating);
    color.bg = "hsl(" + hue + ", 100%, 50%)";
    color.font = "#000";
    if (rating == "无") {
      color.bg = "#757575";
      color.font = "#fff";
    };
    if (hue < 15) {
      color.font = "#fff";
    };

    return color;
  }

  changeMap() {
    console.log("Change Map: ");
    google.maps.event.trigger(this.map, 'resize');

    this.clearAll(); //clear marker
    // let loading = Loading.create({
    //   content: '加载房源...'
    // });
    // this.nav.present(loading);



    let gridSize = 60;	//60px
    //get element size to calcute number of grid
    let mapHeight = window.innerHeight;
    let mapWidth = window.innerWidth;
    let gridx = Math.ceil(mapWidth / gridSize);
    let gridy = Math.ceil(mapHeight / gridSize);
    let _sw = this.map.getBounds().getSouthWest();
    let _ne = this.map.getBounds().getNorthEast();
    let centerlat = (_ne.lat() + _sw.lat()) / 2;
    let centerlng = (_ne.lng() + _sw.lng()) / 2;
    //let HouseArray = [];
    let marker;
    let _bounds = _sw.lat() + "," + _sw.lng() + "," + _ne.lat() + "," + _ne.lng();

    let mapParms = {
      bounds: _bounds,
      gridx: gridx,
      gridy: gridy,
      type: this.selectSchool.selectType,
      rank: this.selectSchool.selectRank,
      xingzhi: this.selectSchool.selectXingzhi,
      pingfen: this.selectSchool.selectPingfen


				};
    
    this.mapleRestData.load('index.php?r=ngget/getSchoolmap', mapParms).subscribe(
      data => {

        this.markerType = data.type;
        this._zone.run(() => {
          this.currentDiv = '';
        });
        //Start Grid Markers
        if (this.markerType == 'grid') {

          for (let p in data.gridList) {
            let school = data.gridList[p];
            let schoolcount = school.SchoolCount;
            if (schoolcount > 0) {
              let avgrating = Math.round(school.TotalRating * 10 / schoolcount) / 10;
              //console.log( "Name:" + school.GeocodeLat + "Lat:" + school.GeocodeLng + "Count:"+ school.SchoolCount + "TotalRating:" + school.TotalRating + "AvgRating:" + avgrating);
              this.setContentCount(school.GeocodeLat, school.GeocodeLng, school.SchoolCount, school.GridName, avgrating);

            }
          }
        } //End of City Markers
        this.schoolList = data.SchoolList;
        if ((this.markerType == 'school') && (this.schoolList.length > 0)) {

          this._zone.run(() => {
            this.currentDiv = 'listButton';
          });

          for (let p in data.SchoolList) {
            let school = data.SchoolList[p];
            var name = school.School;
            var rank = school.Paiming;
            var rating = school.Pingfen;
            var tlat = parseFloat(school.Lat);
            var tlng = parseFloat(school.Lng);

            //Generate single house popup view
            var html = "<p text-left>名称：" + name + "</p>"
              + "<p text-left>年级：" + school.Grade + "</p>"
              + "<p text-left>地址：" + school.Address + "</p>"
              + "<p text-left>城市：" + school.City + " " + school.Province + " " + school.Zip + "</p>"
              + "<p text-left>排名：</ion-label><ion-badge>" + rank + "</ion-badge> 评分：<ion-badge>" + rating + "</ion-badge></p>";

            this.setContent(tlat, tlng, html, rating);

          }
        } //End of if HOUSE
      });

    //END of Data Subscribe

  }

  //End of MAP import function

}

