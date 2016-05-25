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
  private items: Array<String>;
  private parms: Object;
  private houselist: any;
  //private map: any;
  constructor(public nav: NavController,private mapleRestData: MapleRestData) {
    this.searchQuery = '';
    this.items = [];
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
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      console.log("Lat:" + resp.coords.latitude + "Lng:" + resp.coords.longitude);
      this.loadMap(latLng);
    })
  }


  loadMap(LatLng) {


    //  let latLng = new google.maps.LatLng(-34.9290, 138.6010);
    //let latLng = new google.maps.LatLng(-34.9290, 138.6010);
    //this.confData.getMap().then(mapData => {
    let mapEle = document.getElementById('map');

    let map = new google.maps.Map(mapEle, {
      //center: mapData.find(d => d.center),
      center: LatLng,
      zoom: 16
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

    google.maps.event.addListenerOnce(map, 'idle', () => {
      mapEle.classList.add('show-map');
    });

    //});
  }

  itemTapped(event, item) {
    this.nav.push(HouseDetailPage, {
      item: item
    });
  }
  getItems(searchbar) {
    // Reset items back to all of the items
    this.items = [];

    // set q to the value of the searchbar
    var q = searchbar.value;

    // if the value is an empty string don't filter the items
    if (q.trim() == '') {
      return;
    } else {
      //Call REST
      this.items = ["1", "2", "fdasfasf"];
    }
  }

}


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
