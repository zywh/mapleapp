import {IonicApp, Modal, Platform, NavController, NavParams, Page, ViewController} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import {OnInit} from 'angular2/core';
import {HouseDetailPage} from '../house-detail/house-detail';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';


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
  //private map: any;
  constructor(public nav: NavController, private mapleRestData: MapleRestData) {
    this.searchQuery = '';
    // this.cityItems = [];
    // this.addressItems = [];
    // this.mlsItems = [];
    this.resetItems();
  }

  //  ngOnInit() {
  //     this.getResult('index.php?r=ngget/getMapHouse');
  //   }

  openModal(characterNum) {
    let modal = Modal.create(MapSearchOptionsPage, characterNum);
    this.nav.present(modal);
  }

  getResult(url) {
    this.mapleRestData.load(url, this.parms).subscribe(
      data => { this.houselist = data.Data; console.log(this.houselist) }

    )
  }

  //onPageLoaded() {
  ngOnInit() {
    Geolocation.getCurrentPosition().then((resp) => {

      if (resp.coords.latitude > 20) {
        let lat = resp.coords.latitude;
        let lng = resp.coords.longitude;
        console.log("Lat:" + resp.coords.latitude + "Lng:" + resp.coords.longitude);
        this.loadMap(lat, lng, 16);

      } else {
        //default to Toronto
        let lat: Number = 43.6532;
		      let lng: Number = -79.3832;
        //let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
        this.loadMap(lat, lng, 16);
      }

    })
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

    // mapData.forEach(markerData => {
    //   let infoWindow = new google.maps.InfoWindow({
    //     content: `<h5>${markerData.name}</h5>`
    //   });

    //   let marker = new google.maps.Marker({
    //     position: markerData,
    //     map: map,
    //     title: markerData.name
    //   });

    //   marker.addListener('click', () => {
    //     infoWindow.open(map, marker);
    //   });
    // });

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
    });

    //});
  }
  //select autocomplete action
  resetItems() {
    this.cityItems = [];
    this.addressItems = [];
    this.mlsItems = [];
    this.searchQuery = '';
  }
  itemTapped(event, item, type) {
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
    // Reset items back to all of the items
    this.cityItems = [];
    this.addressItems = [];
    this.mlsItems = [];

    // set q to the value of the searchbar
    var q = searchbar.value;

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
  }
}

//Map Option Page
@Page({
  templateUrl: './build/pages/map-search/map-search-options.html'
})
class MapSearchOptionsPage {
  character;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
    var characters = [
      {
        name: 'Gollum',
        quote: 'Sneaky little hobbitses!',
        image: 'img/avatar-gollum.jpg',
        items: [
          { title: 'Race', note: 'Hobbit' },
          { title: 'Culture', note: 'River Folk' },
          { title: 'Alter Ego', note: 'Smeagol' }
        ]
      },
      {
        name: 'Frodo',
        quote: 'Go back, Sam! I\'m going to Mordor alone!',
        image: 'img/avatar-frodo.jpg',
        items: [
          { title: 'Race', note: 'Hobbit' },
          { title: 'Culture', note: 'Shire Folk' },
          { title: 'Weapon', note: 'Sting' }
        ]
      },
      {
        name: 'Samwise Gamgee',
        quote: 'What we need is a few good taters.',
        image: 'img/avatar-samwise.jpg',
        items: [
          { title: 'Race', note: 'Hobbit' },
          { title: 'Culture', note: 'Shire Folk' },
          { title: 'Nickname', note: 'Sam' }
        ]
      }
    ];
    this.character = characters[this.params.get('charNum')];
    console.log("DEBUG IMAGE:" + this.character.image);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


}
