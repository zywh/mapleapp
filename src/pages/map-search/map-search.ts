import { ModalController, LoadingController, Events, AlertController, PopoverController, ActionSheet, MenuController, Platform, NavController, NavParams, ViewController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { NgZone, Component, ElementRef, ViewChild } from '@angular/core';;
import { Connectivity } from '../../providers/connectivity';
import { HouseDetailPage } from '../house-detail/house-detail';
import { HouselistSearch } from '../houselist-search/houselist-search';
import { MapleConf } from '../../providers/maple-rest-data/maple-config';
import { MapleRestData } from '../../providers/maple-rest-data/maple-rest-data';
import { Observable } from 'rxjs/Observable';
//import {GoogleMaps} from '../../providers/google-maps/google-maps';
//import {GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, GoogleMapsMarker} from 'ionic-native';
import { SelectOptionModal } from './map-option-modal';
import { MapHouselist } from './map-houselist';
//import {ConferenceData} from '../../providers/conference-data';
import { SchoolSelectOptionModal } from '../school-map/schoolmap-option-modal';
import { SchoolListModal } from '../school-map/school-list-modal';
//import {HousePopover} from './house-popover';
import { AuthService } from '../../providers/auth/auth';
import { UserData } from '../../providers/user-data';

declare var RichMarker: any;
declare var google;

@Component({
  templateUrl: 'map-search.html'
})


export class MapSearchPage {

  @ViewChild('map') public mapElement: ElementRef;
  public mapLib = 1; // 0 is java and 1 is native google SDK
  public queryText: String = '';
  public mapInitialised: boolean = false;
  //mapLoaded: any;
  //mapLoadedObserver: any;
  public searchInFocus: boolean = false;
  public cityItems: any;
  public addressItems: any;
  public mlsItems: any;
  public schoolItems: any;
  public parms: Object;
  // public defaultcenter = new google.maps.LatLng(43.6532, -79.3832);
  public defaultcenter;
  public houselist: any;
  public map = null;
  public center;
  public markerArray = [];
  public htmlArray = [];
  public mviewLoaded: Boolean = false;
  public htmlArrayPosition = 0;
  public totalCount: Number; //Returned House
  public listAllHtml = ''; //hold houses on current map
  public isListShow: boolean = false;
  public markerType;
  public imgHost: String;
  //public listModal: ViewController;
  public listModal;
  public defaultZoom: Number = 14;
  public _bounds;
  public locateLock: Boolean = false; //lock location button if there is input popup

  public schoolList: Array<any>;
  public swiperOptions = {
    //loop: true,
    //pager: true,
    //speed: 4000,
    spaceBetween: 20,
    slidesPerView: 'auto',
    //loopedSlides: 10
    autoplay: 3000
  };

  public selectOptions;
  public optionPage;
  public savedOptions;
  public currentHouseList; //Hold list of all houses on current map
  public currentHouses; //Hold array of houses for single marker
  public currentDiv;
  public mapType: Number = 1; // 0 for house and 1 for school
  public markerDrop;
  public lockMapListener: Boolean = false;


  constructor(
    public nav: NavController,
    private auth: AuthService,
    public platform: Platform,
    private mapleRestData: MapleRestData,
    private userData: UserData,
    public connectivityService: Connectivity,
    private menu: MenuController,
    private mapleconf: MapleConf,
    private navparm: NavParams,
    private _zone: NgZone,
    private viewCtrl: ViewController,
    private alertc: AlertController,
    private modalc: ModalController,
    private loadingc: LoadingController,
    private popoverc: PopoverController,
    private events: Events
  ) {


    this.mapType = this.navparm.data.pageType;
    //this.resetItems();
    this.setMapType(this.mapType);
    this.listenEvents();

  }

  listenEvents() {
    this.events.subscribe('locate:dismiss', () => {
      this.locateLock = false;
      this.lockMapListener = false;
      this.setLocation(this.defaultcenter, this.defaultZoom, true);
    });
    this.events.subscribe('schoolmap:center', () => {
      console.log("List modal dismiss")
      this.listModal.dismiss();
    });




  }

  initMap() {

    this.mapInitialised = true;

    let loading = this.loadingc.create({
      content: '加载地图...'
    });
    //loading.present();


    //let mapEle = document.getElementById('map');
    this.mapleconf.getLocation().then(data => {
      this.defaultcenter = new google.maps.LatLng(data['lat'], data['lng']);
      //this.defaultcenter = this.mapLatLng(data['lat'], data['lng']);

      if (this.navparm.data.parms.lat > 20) {
        console.log("Redirect from other page with center");
        this.defaultcenter = new google.maps.LatLng(this.navparm.data.parms.lat, this.navparm.data.parms.lng);
        //this.defaultcenter = this.mapLatLng(data['lat'], data['lng']);
      }


      let mapOptions = {
        //center: latLng,
        center: this.defaultcenter,
        minZoom: 4,
        controls: {
          'compass': true,
          'myLocationButton': true,
          'indoorPicker': true,
          'zoom': true
        },
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
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }



      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      //loading.dismiss();
      google.maps.event.addListener(this.map, 'idle', () => {
        this.changeMap(this.mapType);
      });




      //Add marker if it's redirected from school page
      console.log(this.navparm.data.parms.type);
      if (this.navparm.data.parms.type != 'NONE') {

        this.setLocation(this.defaultcenter, 13, this.navparm.data.parms.type)
      }


    });


  }



  ionViewWillEnter() {
    console.log("Map View will enter");
    this.lockMapListener = false; //unlock after view enter
    let optionType = (this.mapType == 0) ? 'houseSearch' : 'schoolSearch';

    if (this.auth.authenticated()) {
      this.userData.getUserSelections(optionType).then(res => {
        if (res != null) {
          this.selectOptions = res;
        }

      })
    }



  }


  ionViewDidEnter() {

    if (!this.mapInitialised) {

      let mapLoaded = this.initMap();
      let alert = this.alertc.create({
        title: '提示',
        message: '根据TREB数据协议，有些房源只有登录后才可以显示，请注册/登录后查找更多房源',
        buttons: [
          {
            text: '继续',
            role: 'cancel',


          },
          {
            text: '登录',
            handler: () => {
              alert.dismiss().then(res => {
                this.events.publish('profile:login');

              })

            }
          }
        ]
      });

      if (!this.auth.authenticated()) {
        alert.present();
      }

    }


  }

  ionViewDidLeave() {
    console.log("Map view did leave")
    this.lockMapListener = true; //lock change map after view switch. workaround for android searchbar trigger map data refresh
  }



  openModal() {
    this.lockMapListener = true;
    let modal = this.modalc.create(this.optionPage, { data: this.selectOptions, type: this.mapType });
    modal.onDidDismiss(data => {
      this.selectOptions = data;
      this.lockMapListener = false;
      console.log("Option Modal is dismissed");
      console.log(data);
      //if ( this.selectOptions.hasOwnProperty('selectSearch')) {
      if (this.selectOptions.selectSearch.type == 'CITY') {
        let center = new google.maps.LatLng(this.selectOptions.selectSearch.lat, this.selectOptions.selectSearch.lng);
        this.setLocation(center, this.defaultZoom, true);
        console.log("Set city center");
      }

      this.changeMap(this.mapType);

    });

    modal.present();


  }



  getResult(url) {
    this.mapleRestData.load(url, this.parms).subscribe(
      data => { this.houselist = data.Data; }

    )
  }




  gotoHouseDetail(mls) {
    this.nav.push(HouseDetailPage, { id: mls, list: this.currentHouseList });
  }

  openList(ev) {


    if (this.mapType == 0) {


      if ((this.markerType == 'house') && (this.totalCount > 0)) {

        //let modal = this.modalc.create(MapHouselist, { list: this.currentHouseList, imgHost: this.imgHost });
        //let modal = this.modalc.create(HouselistSearch, { list: this.currentHouseList, imgHost: this.imgHost, listType: 'house' });
        // this.listModal = this.modalc.create(HouselistSearch, { list: this.currentHouseList, imgHost: this.imgHost, listType: 'house' });

        // this.listModal.present();
        this.nav.push(HouselistSearch, { list: this.currentHouseList, imgHost: this.imgHost, listType: 'house' });

      } else {

        //this.nav.push(HouselistSearch, { opts: this.selectOptions, bounds: this._bounds });
        console.log(this.selectOptions);
        //let modal = this.modalc.create(HouselistSearch, { searchOptions: this.selectOptions, bounds: this._bounds, listType: 'grid' });
        //modal.present();
        // this.listModal = this.modalc.create(HouselistSearch, { searchOptions: this.selectOptions, bounds: this._bounds, listType: 'grid' });
        // this.listModal.present();
        this.nav.push(HouselistSearch, { searchOptions: this.selectOptions, bounds: this._bounds, listType: 'grid' });


      }
    } else {

      let modal = this.modalc.create(SchoolListModal, { data: this.schoolList });
      modal.present();
    }

  }

  //select autocomplete action

  setMapType(type) {

    if (type == 0) {
      //init house page parm
      this.selectOptions = {
        selectSR: true,
        selectBaths: 0,
        selectBeds: 0,
        selectHousesize: { lower: 0, upper: 4000 },
        selectLandsize: { lower: 0, upper: 43560 },
        selectPrice: { lower: 0, upper: 600 },
        selectType: '',
        selectListType: true,
        selectDate: 0

      }
      this.optionPage = SelectOptionModal;
    } else {
      //init school map parm
      this.selectOptions = {
        selectPingfen: 0,
        selectRank: 0,
        selectType: false,
        selectXingzhi: ''

      }
      this.optionPage = SchoolSelectOptionModal;
    }


  }




  //SetCenter and Zoom if location button is clicked
  setCenter(isMarker) {
    this.lockMapListener = true; // lock listener to prevent Android map listener trigger
    this.locateLock = true; //lock locate click to prevent frozen from double click
    this.mapleconf.getLocation().then(data => {

      this.defaultcenter = new google.maps.LatLng(data['lat'], data['lng']);
      if (this.auth.authenticated()) {
        this.userData.addCenterAlert(data['lat'], data['lng'], "保存中心位置到我的收藏");


        // this.userData.addCenterAlert(data['lat'], data['lng'], "保存中心位置到我的收藏").then(res=>{
        //  this.setLocation(this.defaultcenter, this.defaultZoom, isMarker);
        //  this.lockMapListener = false;

        //});
      } else {
        this.locateLock = false;
        this.setLocation(this.defaultcenter, this.defaultZoom, isMarker);
        this.lockMapListener = false;
      }


    })
  }

  // //Move to center and creata a marker
  setLocation(center, zoom, isMarker) {

    this.map.setZoom(zoom);
    this.map.setCenter(center);
    if (this.markerDrop != null) {
      this.markerDrop.setMap(null);
    }

    if (isMarker) {
      this.markerDrop = new google.maps.Marker({
        position: center,
        map: this.map,
        animation: google.maps.Animation.DROP,
        draggable: false,
      });
      this.markerDrop.addListener('click', () => {
        if (this.markerDrop.getAnimation() !== null) {
          this.markerDrop.setAnimation(null);
        } else {
          this.markerDrop.setAnimation(google.maps.Animation.BOUNCE);
        }
      })


    }
  }


  setContent(lat, lng, count, html, houses, price, house) {
    let point = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
    //let content = this.setMarkerCss(count, price);
    console.log("Set House Content Marker")
    let content = this.mapleconf.setHouseMarkerCss(count, price);
    let marker = new RichMarker({
      position: point,
      map: this.map,
      draggable: false,
      content: content,
      flat: true
    });
    this.markerArray.push(marker);


    marker.addListener('click', () => {
      if (count == 1) {
        let alert = this.alertc.create({
          //title: 'Confirm purchase',
          message: html,
          cssClass: 'house_popup',
          buttons: [
            {
              text: '取消',
              role: 'cancel',

            },
            {
              text: '详情',
              handler: () => {
                //let navTransition = alert.dismiss();
                // navTransition.then(() => {
                //this.nav.pop();
                alert.dismiss();
                this.nav.push(HouseDetailPage, { id: house.MLS, list: this.currentHouseList });
                //this.nav.push(HouseDetailPage, mls); 
                //});
                return false;
              }
            }
          ]
        });
        // this.nav.present(alert);
        alert.present();
        //this.housePopover(house);
      } else {
        console.log("More than one");
        // this.listModal = Modal.create(MapHouselist, { list: houses, imgHost: this.imgHost });
        // this.nav.present(this.listModal);
        this.nav.push(MapHouselist, { list: houses, imgHost: this.imgHost });


      }


    });


  }
  setSchoolContent(lat, lng, html, rating) {
    console.log("Set School Marker Content")
    let point = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
    let content = this.mapleconf.setSchoolMarkerCss(rating);
    let marker = new RichMarker({
      position: point,
      map: this.map,
      draggable: false,
      content: content,
      flat: true
    });
    this.markerArray.push(marker);

    marker.addListener('click', () => {

      let alert = this.alertc.create({
        title: '学校简介',
        message: html,
        cssClass: 'school_popup',
        buttons: [{ text: '取消', role: 'cancel' },
        {
          text: '周边房源',
          handler: () => {
            this.events.publish('map:center', { lat: lat, lng: lng, type: 'SCHOOL' });
            // this.events.publish('map:center', point);
            //this.nav.push(MapSearchPage, { lat: lat, lng: lng });
          }
        }
        ]
      });
      alert.present();
      //   //infowindow.open(this.map, marker);
    });


  }
  //set grid and city marker
  setContentCount(lat, lng, totalCount, city, number) {
    //let content = "<i class='icon_map_mark'><span>" + totalCount + "</span></i>";
    let point = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
    let content = '';
    if (this.mapType == 1) {
      content = this.mapleconf.setSchoolMarkerCss(number); //default color
    } else {
      content = this.mapleconf.setHouseMarkerCss(totalCount, number); //default color
    }


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

    this.htmlArray = [];
    this.htmlArrayPosition = 0;

  }

  changeMap(type) {

    if (this.lockMapListener == false) {
      console.log("change map" + type);
      // let loading = this.loadingc.create({
      //   content: '加载数据...'
      // });
     
      // loading.present();

      this.clearAll(); //clear marker



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
      let HouseArray = [];

      let marker;
      let mapParms;
      this._bounds = _sw.lat() + "," + _sw.lng() + "," + _ne.lat() + "," + _ne.lng();
      if (type == 1) {
        mapParms = {
          bounds: this._bounds,
          gridx: gridx,
          gridy: gridy,
          type: this.selectOptions.selectType,
          rank: this.selectOptions.selectRank,
          xingzhi: this.selectOptions.selectXingzhi,
          pingfen: this.selectOptions.selectPingfen


        };
      } else {
        mapParms = {
          bounds: this._bounds,
          gridx: gridx,
          gridy: gridy,
          sr: (this.selectOptions.selectSR == true) ? 'Sale' : 'Lease',
          housetype: this.selectOptions.selectType,
          houseprice: this.selectOptions.selectPrice,
          houseroom: this.selectOptions.selectBeds,
          housearea: this.selectOptions.selectHousesize,
          houseground: this.selectOptions.selectLandsize,
          housedate: this.selectOptions.selectDate

        };
      }

      //console.log("Map House Search Parms:" + mapParms);
      this.mapleconf.load().then(data => {

        let restUrl = data.mapHouseRest;
        if (type == 1) {
          restUrl = data.getSchoolmapDataRest;
        }
        this.mapleRestData.load(restUrl, mapParms).subscribe(
          data => {
            console.log("MapType:" + type)
            //loading.dismiss();
            if (type == 0) {
              this.processHouseData(data);
            } else {
              this.processSchoolData(data);
            }


          },
          error => {

           // this.restError(loading);
           this.presentError();
           
          }
        );

        //END of Data Subscribe
      })

    }

  }

  restError(loading) {
    loading.dismiss().then(res => this.presentError());
  }
  presentError() {
    let alert = this.alertc.create({
      title: '警告',
      message: '数据装载超时，重试?',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            alert.dismiss();
          }
        },
        {
          text: '重试',
          handler: () => {
            alert.dismiss().then(res => this.changeMap(this.mapType));
          }
        }
      ]
    });
    alert.present();
  }

  processHouseData(data) {
    this.totalCount = data.Data.Total;
    this.markerType = data.Data.Type;

    //Start City Markers
    if ((this.markerType == 'city') || (this.markerType == 'grid')) {
      // this._zone.run(() => {
      //   this.isListShow = false;
      //   this.currentDiv = '';
      // });
      for (let p in data.Data.AreaHouseCount) {

        let areaHouse = data.Data.AreaHouseCount[p];
        if (areaHouse.HouseCount > 0) {
          let price = areaHouse.TotalPrice / areaHouse.HouseCount;
          //console.log("Name:" + areaHouse.NameCn + "Lat:" + areaHouse.GeocodeLat + "Count:" + areaHouse.HouseCount + "AvgPrice:" + price);
          this.setContentCount(areaHouse.GeocodeLat, areaHouse.GeocodeLng, areaHouse.HouseCount.toString(), areaHouse.NameCn, price);

        }
      }
    }   //End of City Markers


    if (this.markerType == 'house') {
      // this._zone.run(() => {
      //   this.isListShow = true;
      //   this.currentDiv = 'listButton';
      // });
      let count = 1;
      let houses = [];
      let totalprice = 0;
      let totalhouse = data.Data.HouseList.length;
      this.imgHost = data.Data.imgHost;
      let nextLat;
      let nextLng;
      let listAllHtml;
      this.currentHouseList = data.Data.HouseList;
      let panelhtml;
      // console.log("Current House List Length:" + this.currentHouseList.length);

      // console.log('Image Host:' + this.imgHost);
      for (let index = 0, l = totalhouse; index < l; index++) {
        let house = data.Data.HouseList[index];


        if (index < (totalhouse - 1)) {
          nextLat = data.Data.HouseList[index + 1].GeocodeLat;
          nextLng = data.Data.HouseList[index + 1].GeocodeLng;

        }
        //console.log("Current:" + this.GeocodeLng + "Next:" + nextLng + "Total:" + totalhouse + "index:" + index + "Count:" + count);
        //let imgurl = this.imgHost + house.CoverImg;
        //let imgurltn = this.imgHost + house.CoverImgtn;
         let imgurl =  house.CdnCoverImg;
        let imgurltn = house.CdnCoverImgtn;
        
        let hprice = (house.SaleLease == 'Lease') ? Math.round(house.Price) * 10000 + '加元/月' : Math.round(house.Price) + '万加元';
        let markerprice = Math.round(house.Price);

        let tlat = parseFloat(house.GeocodeLat);
        let tlng = parseFloat(house.GeocodeLng);


        let li = ' <ion-card>'
          + '<img src="' +  house.CdnCoverImg + '" />'
          + '<div class="house_desc" text-left text-nowrap>'
          // + '<ion-item padding-left>'
          + '<ion-badge item-left>MLS:' + house.MLS + '</ion-badge>'
          + '  <ion-badge item-right><i class="fa fa-usd" aria-hidden="true"></i>' + this.mapleconf.getPriceTxt(house.SaleLease, house.Price) + '</ion-badge>'
          // + '   </ion-item>'

          + '    <div class="card-subtitle" text-left>'
          // + '     <div><i padding-right secondary class="fa fa-building" aria-hidden="true"></i><span padding-right>' + house.HouseType + '</span>' + house.Beds + '卧' + house.Baths + '卫' + house.Kitchen + '厨</div>'
          // + '     <div><i padding-right secondary class="fa fa-location-arrow" aria-hidden="true"></i><span padding-right>' + house.Address + '</span>' + house.MunicipalityName + '</div>'
          + '<div>' + house.HouseType + '</div>'
          + '<div>' + house.Address + ',' + house.MunicipalityName + '</div>'
          + '</div></div>'
          + ' </ion-card> '

        if ((nextLng != house.GeocodeLng) || (nextLat != house.GeocodeLat)) {

          if (count == 1) {


            houses.push(house);
            //this.setContent(tlat, tlng, 1, houses, markerprice);
            //this.setContent(tlat, tlng, 1, li, house, markerprice, house.MLS);
            this.setContent(tlat, tlng, 1, li, house, markerprice, house);
            houses = [];
            totalprice = 0;
            panelhtml = '';
          } else {
            //generate panel list view

            houses.push(house);
            panelhtml = panelhtml + li;
            let price = (totalprice + markerprice) / count;
            //this.setContent(tlat, tlng, count, houses, price);
            // this.setContent(tlat, tlng, count, panelhtml, price, house.MLS);
            this.setContent(tlat, tlng, count, panelhtml, houses, price, house.MLS);
            count = 1;
            totalprice = 0;
            houses = [];
            panelhtml = '';

          }


        }
        else {
          ++count;
          totalprice = totalprice + markerprice;
          houses.push(house);
          panelhtml = panelhtml + li;
        }

      }
    } //End of if HOUSE

  }

  processSchoolData(data) {
    this.markerType = data.type;
    this.currentDiv = '';

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
          + "<p text-left>排名：<ion-badge>" + rank + "</ion-badge> 评分：<ion-badge>" + rating + "</ion-badge></p>";

        this.setSchoolContent(tlat, tlng, html, rating);

      }
    } //End of if HOUSE

  }

  //End of MAP import function

  // housePopover(house) {
  //   let popover = this.popoverc.create(HousePopover, {
  //     house: house,
  //     list: this.currentHouseList,
  //     imgHost: this.imgHost
  //   });

  //   popover.present();

  // }

}


