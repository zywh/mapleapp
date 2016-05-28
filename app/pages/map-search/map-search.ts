import {IonicApp, Modal, Alert, MenuController, Platform, NavController, NavParams, Page, ViewController} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
//import {AngularRange} from 'angular-ranger';
//import {RichMarker} from 'rich-marker';
import {OnInit} from 'angular2/core';
import {HouseDetailPage} from '../house-detail/house-detail';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
declare var RichMarker: any;

/*
  Generated class for the MapSearchPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/map-search/map-search.html',
})


export class MapSearchPage implements OnInit {

  private searchQuery: String;
  private cityItems: any;
  private addressItems: any;
  private mlsItems: any;
  private parms: Object;

  private houselist: any;
  public map;
  private center;
  private markerArray = [];
  private htmlArray = [];
  private htmlArrayPosition = 0;
  private totalCount: Number; //Returned House
  private listAllHtml = ''; //hold houses on current map
  public isListShow: boolean = false;
  private markerType;
  private imgHost: String;

  //selection Parms
  private selectPrice;
  private selectType;
  private selectBeds;
  private selectBaths;
  private selectHousesize;
  private selectLandsize;
  private currentHouseList; //Hold list of all houses on current map
  private currentHouses; //Hold array of houses for single marker

  private currentDiv;

  constructor(
    public nav: NavController,
    private mapleRestData: MapleRestData,
    private menu: MenuController
  ) {
    this.searchQuery = '';
    this.resetItems();

  }

  //  ngOnInit() {
  //     this.getResult('index.php?r=ngget/getMapHouse');
  //   }


  updateOption() {
    this.changeMap();
    this.currentDiv = '';
    console.log("Change Options:" + this.selectPrice);
  }
  // openModal(characterNum) {
  //   let modal = Modal.create(MapSearchOptionsPage, characterNum);
  //   this.nav.present(modal);
  // }


  getResult(url) {
    this.mapleRestData.load(url, this.parms).subscribe(
      data => { this.houselist = data.Data; console.log(this.houselist) }

    )
  }

  //onPageLoaded() {
  ngOnInit() {
    let options = { timeout: 10000, enableHighAccuracy: true };

    // navigator.geolocation.getCurrentPosition(

    //   (position) => {

    //     //let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    //     let lat = position.coords.latitude;
    //     let lng = position.coords.longitude;

    //     if (lat > 20) {
    //       this.loadMap(lat, lng, 16);
    //     } else {
    //       let lat: Number = 43.6532;
    //       let lng: Number = -79.3832;
    //       this.loadMap(lat, lng, 16);
    //     }

    //   },

    //   (error) => {
    //     let lat: Number = 43.6532;
    //     let lng: Number = -79.3832;
    //     this.loadMap(lat, lng, 16);
    //     console.log(error);
    //   }, options

    // );
    let lat: Number = 43.6532;
    let lng: Number = -79.3832;
    this.loadMap(lat, lng, 16);

  }
  swiperOptions = {
    loop: true,
    //pager: true,
    speed: 4000,
    autoplay: 300
  };
  listShow() {
    //Show House List
    return ((this.currentDiv == 'houselist') && (this.markerType == 'house'));

  }
  gotoHouseDetail(mls) {
    this.nav.push(HouseDetailPage, mls);
  }
  loadMap(lat, lng, zoom) {

    this.center = new google.maps.LatLng(lat, lng);
    //  let latLng = new google.maps.LatLng(-34.9290, 138.6010);
    //let latLng = new google.maps.LatLng(-34.9290, 138.6010);
    //this.confData.getMap().then(mapData => {
    let mapEle = document.getElementById('map');

    this.map = new google.maps.Map(mapEle, {
      //center: mapData.find(d => d.center),
      center: this.center,
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
      zoom: zoom
    });


    google.maps.event.addListener(this.map, 'idle', () => {
      this.currentDiv = '';
      this.isListShow = true;
      console.log("Print isListShow:" + this.isListShow);
      this.changeMap();

    });

    // google.maps.event.addListener(this.map, 'dragstart', () => {
    //   //this.currentDiv = '';
    //   console.log("CLICKED EVENT Detected: CURRENT DIV-" + this.currentDiv);
    // });



    //});
  }
  //select autocomplete action
  resetItems() {
    this.cityItems = [];
    this.addressItems = [];
    this.mlsItems = [];
    //this.searchQuery = '';
  }
  resetSelections() {
    this.selectPrice = '';
    this.selectType = '';
    this.selectBeds = '';
    this.selectBaths = '';
    this.selectHousesize = '';
    this.selectLandsize = '';
    this.currentHouseList = '';

  }
  itemTapped(event, item, type) {
    console.log("Item tapped:" + type);
    if (type == 1) { //CITY Action
      let lat = item.lat;
      let lng = item.lng;
      let center = new google.maps.LatLng(lat, lng);
      this.setLocation(center, 14);
      this.resetItems();
    }

    if (type == 2) { //MLS Action
      this.nav.push(HouseDetailPage, {
        item: item.id //pass MLS# to house detail
      });
    }

    if (type == 3) { //Address Action
      this.nav.push(HouseDetailPage, {
        item: item.id //pass MLS# to house detail
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


  setContent(lat, lng, count, houses, price) {
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
    var contentString = "fsdafsadfsdafsda";
    var infowindow = new google.maps.InfoWindow({
      content: contentString,
      disableAutoPan: true

    });

    marker.addListener('click', () => {
      let parms = { 
        houses: houses,
        imgHost: this.imgHost
      };
      let modalHouseList = Modal.create(HouseList, parms);
      this.nav.present(modalHouseList);
      console.log(houses);

      //infowindow.open(this.map, marker);
    });


  }

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

    //maplemap.setMarkerCss(totalCount);
		/*Regular Marker
		let marker = new google.maps.Marker({
			position: point,
			map: map,
			draggable: false,
			label: totalCount
		});
		*/

    this.markerArray.push(marker);
    google.maps.event.addListener(marker, 'click', function () {
      this.map.setCenter(this.position);
      let currentzoom = this.map.getZoom();
      this.map.setZoom(currentzoom + 2);
    });


  }

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
    console.log("Change Map: Button Show?" + this.isListShow);
    this.currentDiv = '';
    this.clearAll();


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
    let _bounds = _sw.lat() + "," + _sw.lng() + "," + _ne.lat() + "," + _ne.lng();

    let mapParms = {
      bounds: _bounds,
      gridx: gridx,
      gridy: gridy,
      // sr : 	options['sel_sr'], 
      housetype: this.selectType,
      houseprice: this.selectPrice,
      houseroom: this.selectBeds,
      housearea: this.selectHousesize

				};
    //console.log("Map House Search Parms:" + mapParms);
    this.mapleRestData.load('index.php?r=ngget/getMapHouse', mapParms).subscribe(
      data => {

        this.totalCount = data.Data.Total;
        this.markerType = data.Data.Type;
        console.log("Change Map Refresh Data:" + this.markerType);
        //Start City Markers
        if ((this.markerType == 'city') || (this.markerType == 'grid')) {
          this.isListShow = false;
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
          this.isListShow = true;
          let count = 1;
          let houses = [];
          let totalprice = 0;

          let totalhouse = data.Data.MapHouseList.length;
          this.imgHost = data.Data.imgHost;
          let nextLat;
          let nextLng;
          //let listAllHtml;
          this.currentHouseList = data.Data.MapHouseList;

          console.log("Current House List Length:" + this.currentHouseList.length);

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





            if ((nextLng != house.GeocodeLng) || (nextLat != house.GeocodeLat)) {

              if (count == 1) {
                //Generate single house popup view

                houses.push(house);
                this.setContent(tlat, tlng, 1, houses, markerprice);
                houses = [];

              } else {
                //generate panel list view

                houses.push(house);
                //let htmlp = panelhtml + li;
                let price = (totalprice + markerprice) / count;
                this.setContent(tlat, tlng, count, houses, price);
                count = 1;
                totalprice = 0;
                houses = [];
              }


            }
            else {
              ++count;
              totalprice = totalprice + markerprice;
              houses.push(house);

            }

          }
        } //End of if HOUSE
      });

    //END of Data Subscribe

  }

  //End of MAP import function

}


@Page({
  template: `
  
  <ion-content padding class="houselist_modal">
  
      <ion-slides [options]="swiperOptions" class="swiper-container">
      <ion-slide *ngFor="#house of houselist" class="swiper-slide" (click)="gotoHouseDetail(house.MLS)">
        <ion-card class="house_card">
          <img [src]="imgHost + house.CoverImg" />
          <div padding-left class="house_desc" text-left text-nowrap>
              <h1 primary>MLS:{{house.MLS}}- {{house.Price}}万</h1>
              <div class="card-subtitle" text-left>
              <div><label>类型：</label> {{house.HouseType}}:{{house.Beds}}卧{{house.Baths}}卫{{house.Kitchen}}厨</div>
              <div><label>城市：</label>{{house.Address}},{{house.MunicipalityName}},{{house.ProvinceCname}}</div>
              </div>
          </div>
        </ion-card>
      </ion-slide>

    </ion-slides>
    
    <button (click)="close()">Close</button>
  </ion-content>`
})
class HouseList {
  private houselist;
  private imgHost;
  constructor(
    private platform: Platform,
    private params: NavParams,
    private viewCtrl: ViewController
  ) {
    //this.viewCtrl = viewCtrl;
    console.log(this.params);
    this.houselist = this.params.get('houses');
    this.imgHost = this.params.get('imgHost');
    console.log(this.houselist[0]);
  }


  close() {
    this.viewCtrl.dismiss();
  }
}