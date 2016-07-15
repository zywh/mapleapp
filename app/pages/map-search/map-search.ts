import {Modal, Loading, Events, Alert, Popover, ActionSheet, MenuController, Platform, NavController, NavParams, Page, ViewController} from 'ionic-angular';
//import {Geolocation} from 'ionic-native';
import { NgZone, Component, ElementRef, ViewChild} from '@angular/core';;
import {HouseDetailPage} from '../house-detail/house-detail';
import {HouselistSearch} from '../houselist-search/houselist-search';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {GoogleMaps} from '../../providers/google-maps/google-maps';
import {SelectOptionModal} from './map-option-modal';
import {MapHouselist} from './map-houselist';
//import {ConferenceData} from '../../providers/conference-data';
declare var RichMarker: any;

interface selectOptionsObj {
  selectPrice?: String,
  selectType?: Number,
  selectBeds?: Number,
  selectBaths?: Number,
  selectSR?: Boolean,
  selectHousesize?: String,
  selectLandsize?: String,
  selectListType?: Boolean,
  selectDate?: Number
}

@Component({
  templateUrl: 'build/pages/map-search/map-search.html',
   providers: [GoogleMaps]
})


export class MapSearchPage {
  
  // @ViewChild('map') mapElement: ElementRef;
  // @ViewChild('pleaseConnect') pleaseConnect: ElementRef;

  private queryText: String = '';
  private cityItems: any;
  private addressItems: any;
  private mlsItems: any;
  private parms: Object;
  private defaultcenter = new google.maps.LatLng(43.6532, -79.3832);
  private houselist: any;
  private map = null;
  private center;
  private markerArray = [];
  private htmlArray = [];
  private mviewLoaded: Boolean = false;
  private htmlArrayPosition = 0;
  private totalCount: Number; //Returned House
  private listAllHtml = ''; //hold houses on current map
  public isListShow: boolean = false;
  private markerType;
  private imgHost: String;
  private listModal: ViewController;
  private defaultZoom: Number = 14;
  private _bounds;
  private swiperOptions = {
    //loop: true,
    //pager: true,
    //speed: 4000,
    spaceBetween: 20,
    slidesPerView: 'auto',
    //loopedSlides: 10
    autoplay: 3000
  };
  private selectOptions = {
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


  private currentHouseList; //Hold list of all houses on current map
  private currentHouses; //Hold array of houses for single marker

  private currentDiv;

  constructor(
    public nav: NavController,
    //public maps: GoogleMaps, 
    public platform: Platform,
    private mapleRestData: MapleRestData,
    private menu: MenuController,
    private mapleconf: MapleConf,
    private navparm: NavParams,
    private _zone: NgZone,
    private viewCtrl: ViewController,
    private events: Events
  ) {
    //this.searchQuery = '';

    this.resetItems();
    this.listenEvents(); //listen School map event
    this.loadRichMarker();

  }

  loadRichMarker() {
    let script = document.createElement("script");
    script.src = "extjs/richmarker.js";
    document.body.appendChild(script);
  }

  //change center if school is selected from school map page
  listenEvents() {
    this.events.subscribe('map:center', (data) => {
      this.mviewLoaded = true;
      let center = data[0];
      setTimeout(() => {

        this.nav.pop();//pop house detail page
        let marker = new google.maps.Marker({
          position: center,
          map: this.map,
          draggable: false,
        });
        this.setLocation(center, this.defaultZoom, true);
      }, 50);

    });
    this.events.subscribe('schoolmap:center', (data) => {
      setTimeout(() => {
        this.nav.pop();
      }, 50);
    });
  }
  // optionChange(event) {
  //   this.currentDiv = '';
  //   this.selectOptions = event;
  //   this.maps.changeMap(this.selectOptions);

  // }
  openModal(opt) {
    let modal = Modal.create(SelectOptionModal, { data: opt });
    modal.onDismiss(data => {
      this.selectOptions = data;
      //console.log(this.selectOptions);
      //this.changeMap();
      this.maps.changeMap(this.selectOptions);
      
    });
    this.nav.present(modal);
  }

  //first time view is entered. add listener
  ionViewWillEnter() {
  
      if (!this.mviewLoaded) {
      setTimeout(() => {
        console.log("First Time Will enter view Add Google Map listener")
        this.mviewLoaded = true;
        this.setCenter(false);
        google.maps.event.addListener(this.map, 'idle', () => { this.changeMap(); });
        google.maps.event.addListener(this.map, 'click', () => {
          //close all open POP UP options/list etc
          this._zone.run(() => {
            this.currentDiv = '';
            this.queryText = '';

          });

        });
      }, 50);
    }

  }
  ionViewDidEnter() {
     console.log("Map View did entered");
        if ((this.markerArray.length == 0) && (!this.mviewLoaded)) {
            setTimeout(() => {
                //console.log("School Map is entered No marker First Time. Zoom and center")
               this.map.setZoom(13); //need keep zoom different to have calling loading properly to avoid blank
               this.setCenter(false);
            }, 100);
        }
  }


  // }

  getResult(url) {
    this.mapleRestData.load(url, this.parms).subscribe(
      data => { this.houselist = data.Data; }

    )
  }

 

  
  ionViewLoaded() {
   console.log("Map ViewLoaded");
    setTimeout(() => {
      let mapEle = document.getElementById('map');

      this.map = new google.maps.Map(mapEle, {

        center: this.defaultcenter,
        minZoom: 4,
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
        zoom: 12
      });

    }, 50); //wait for switch to avoid blank map



  }




  gotoHouseDetail(mls) {
    this.nav.push(HouseDetailPage, { id: mls, list: this.currentHouseList });
  }

  openHouseList(ev) {

    if ((this.markerType == 'house') && (this.totalCount > 0)) {
      this.nav.push(MapHouselist, { list: this.currentHouseList, imgHost: this.imgHost })

    } else {

      this.nav.push(HouselistSearch, { opts: this.selectOptions, bounds: this._bounds });


    }
  }

  //select autocomplete action
  resetItems() {
    this.cityItems = [];
    this.addressItems = [];
    this.mlsItems = [];
    //this.queryText = '';
  }
 

  itemTapped(item) {

    let center = new google.maps.LatLng(item.lat, item.lng);
    this.currentDiv = '';
    this.queryText = '';
    console.log("Set Center and clear text");
    this.setLocation(center, this.defaultZoom, true);

  }
  //auto complete REST CAll
  searchFocus(){
    console.log("Search box is focused");
    this.queryText='';
  }
  getItems(ev) {

    this.resetItems();
    let val = ev.target.value;
   
    if (val && val.trim() != '') {
      this.currentDiv = 'searchlist';
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

          }); //end of callback

        //}
      })
    }
  }

  //SetCenter and Zoom if location button is clicked
  setCenter(isMarker) {
    this.mapleconf.getLocation().then(data => {
      this.defaultcenter = new google.maps.LatLng(data['lat'], data['lng']);
      // this.setLocation(this.defaultcenter, this.defaultZoom, isMarker);
      this.setLocation(this.defaultcenter, this.defaultZoom, isMarker);
    })
  }

  // //Move to center and creata a marker
  setLocation(center, zoom, isMarker) {

    this.map.setZoom(zoom);
    this.map.setCenter(center);
    if (isMarker) {
      let marker = new google.maps.Marker({
        position: center,
        map: this.map,
        draggable: false,
      });
    }
  }


  setContent(lat, lng, count, html, houses, price, mls) {
    let point = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
    let content = this.setMarkerCss(count, price);
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
        let alert = Alert.create({
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
                let navTransition = alert.dismiss();
                navTransition.then(() => {
                  this.nav.pop();
                  this.nav.push(HouseDetailPage, { id: mls, list: this.currentHouseList });
                  //this.nav.push(HouseDetailPage, mls); 
                });
                return false;
              }
            }
          ]
        });
        this.nav.present(alert);
      } else {
        console.log("More than one");
        // this.listModal = Modal.create(MapHouselist, { list: houses, imgHost: this.imgHost });
        // this.nav.present(this.listModal);
        this.nav.push(MapHouselist, { list: houses, imgHost: this.imgHost });


      }


    });


  }
  //set grid and city marker
  setContentCount(lat, lng, totalCount, city, price) {
    //let content = "<i class='icon_map_mark'><span>" + totalCount + "</span></i>";
    let point = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
    let content = this.setMarkerCss(totalCount, price); //default color
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

  setMarkerCss(countn, price) {
    let markercontent = '';

    let color = "hsl(" + this.getPrice2Scale(price) + ", 100%, 50%)";
    if (countn < 10) {
      // markercontent = "<i class='common_bg icon_map_mark16' style='background-color:" + color + ";'><span>" + countn + "</span></i>";
      markercontent = "<i class=' icon_map_mark1' style='background-color:" + color + ";'><span>" + countn + "</span></i>";
    }
    if ((countn >= 10) && (countn < 100)) {
      markercontent = "<i class=' icon_map_mark2' style='background-color:" + color + ";'><span>" + countn + "</span></i>";
    }
    if ((countn >= 100) && (countn < 1000)) {
      markercontent = "<i class=' icon_map_mark3' style='background-color:" + color + ";'><span>" + countn + "</span></i>";
    }
    if (countn >= 1000) {
      markercontent = "<i class='icon_map_mark4' style='background-color:" + color + ";'><span>" + countn + "</span></i>";
    }

    return markercontent;

  }

  getPrice2Scale(price) {

    //let wanPrice = Math.log2(price);
    let wanPrice = Math.ceil(price / 10);
    let hue = 0;
    let hueStart = 0;
    let hueEnd = 70;

    //let maxPrice = Math.log2(500); // In 10,000
    let maxPrice = 50; // In 10,000
    let minPrice = 0;
    let PriceStep = (hueEnd - hueStart) / (maxPrice - minPrice);

    if (wanPrice >= maxPrice) {
      hue = 0;
    } else {
      hue = hueEnd - PriceStep * wanPrice;
    }
    //console.log("Price:" + price +" Hue:" + hue + "PriceStep:" + PriceStep);

    return Math.floor(hue);
  }

  changeMap() {
    console.log("Change Map");
    //google.maps.event.trigger(this.map, 'resize');
    this.currentDiv = ''; //reset all popup
    let loading = Loading.create({
      content: '加载房源...'
    });
    this.nav.present(loading);

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
    this._bounds = _sw.lat() + "," + _sw.lng() + "," + _ne.lat() + "," + _ne.lng();

    let mapParms = {
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
    //console.log("Map House Search Parms:" + mapParms);
    this.mapleconf.load().then(data => {

      // this.mapleRestData.load('index.php?r=ngget/getMapHouse', mapParms).subscribe(
      this.mapleRestData.load(data.mapHouseRest, mapParms).subscribe(
        data => {
          loading.dismiss();
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
            this._zone.run(() => {
              this.isListShow = true;
              this.currentDiv = 'listButton';
            });
            let count = 1;
            let houses = [];
            let totalprice = 0;
            let totalhouse = data.Data.MapHouseList.length;
            this.imgHost = data.Data.imgHost;
            let nextLat;
            let nextLng;
            let listAllHtml;
            this.currentHouseList = data.Data.MapHouseList;
            let panelhtml;
            // console.log("Current House List Length:" + this.currentHouseList.length);

            // console.log('Image Host:' + this.imgHost);
            for (let index = 0, l = totalhouse; index < l; index++) {
              let house = data.Data.MapHouseList[index];


              if (index < (totalhouse - 1)) {
                nextLat = data.Data.MapHouseList[index + 1].GeocodeLat;
                nextLng = data.Data.MapHouseList[index + 1].GeocodeLng;

              }
              //console.log("Current:" + this.GeocodeLng + "Next:" + nextLng + "Total:" + totalhouse + "index:" + index + "Count:" + count);
              let imgurl = this.imgHost + house.CoverImg;
              let imgurltn = this.imgHost + house.CoverImgtn;
              let hprice = (house.SaleLease == 'Lease') ? Math.round(house.Price) * 10000 + '加元/月' : Math.round(house.Price) + '万加元';
              let markerprice = Math.round(house.Price);

              let tlat = parseFloat(house.GeocodeLat);
              let tlng = parseFloat(house.GeocodeLng);


              let li = ' <ion-card>'
                + '<img src="' + this.imgHost + house.CoverImg + '" />'
                + '<div class="house_desc" text-left text-nowrap>'
                // + '<ion-item padding-left>'
                + '<ion-badge item-left>MLS:' + house.MLS + '</ion-badge>'
                + '  <ion-badge item-right><i class="fa fa-usd" aria-hidden="true"></i>' + house.Price + '万</ion-badge>'
                // + '   </ion-item>'

                + '    <div class="card-subtitle" text-left>'
                + '     <div><i padding-right secondary class="fa fa-building" aria-hidden="true"></i><span padding-right>' + house.HouseType + '</span>' + house.Beds + '卧' + house.Baths + '卫' + house.Kitchen + '厨</div>'
                + '     <div><i padding-right secondary class="fa fa-location-arrow" aria-hidden="true"></i><span padding-right>' + house.Address + '</span>' + house.MunicipalityName + '</div>'
                + '     </div></div>'
                + ' </ion-card> '

              if ((nextLng != house.GeocodeLng) || (nextLat != house.GeocodeLat)) {

                if (count == 1) {


                  houses.push(house);
                  //this.setContent(tlat, tlng, 1, houses, markerprice);
                  this.setContent(tlat, tlng, 1, li, house, markerprice, house.MLS);
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
        });

      //END of Data Subscribe
    })
  }

  //End of MAP import function

}

