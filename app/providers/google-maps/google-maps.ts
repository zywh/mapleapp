import {Injectable} from '@angular/core';
import {Connectivity} from '../../providers/connectivity/connectivity';
import {Geolocation} from 'ionic-native';
import {Observable} from 'rxjs/Observable';
import {HouseDetailPage} from '../../pages/house-detail/house-detail';
import {HouselistSearch} from '../../pages/houselist-search/houselist-search';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {MapHouselist} from '../../pages/map-search/map-houselist';
import {Modal, Loading, Events, Alert, Popover, ActionSheet, MenuController, Platform, NavController, NavParams, Page, ViewController} from 'ionic-angular';


declare var google;
declare var RichMarker: any;

@Injectable()
export class GoogleMaps {

  mapElement: any;
  pleaseConnect: any;
  map: any;
  mapInitialised: boolean = false;
  mapLoaded: any;
  mapLoadedObserver: any;
  currentMarker: any;
  apiKey: string;

  constructor(
    public connectivityService: Connectivity,
    private mapleconf: MapleConf,
    private mapleRestData: MapleRestData,
    private nav: NavController
  ) {

  }

  init(mapElement: any, pleaseConnect: any): any {

    this.mapElement = mapElement;
    this.pleaseConnect = pleaseConnect;

    this.mapLoaded = Observable.create(observer => {
      this.mapLoadedObserver = observer;
    });

    this.loadGoogleMaps();

    return this.mapLoaded;

  }

  loadGoogleMaps(): void {

    if(typeof google == "undefined" || typeof google.maps == "undefined"){

      console.log("Google maps JavaScript needs to be loaded.");
      this.disableMap();

      if(this.connectivityService.isOnline()){

        window['mapInit'] = () => {
          this.initMap();
          this.enableMap();
        }

        let script = document.createElement("script");
        script.id = "googleMaps";

        if(this.apiKey){
          script.src = "http://ditu.google.cn/maps/api/js?&amp;libraries=places&amp;language=zh-cn&callback=mapInit";
        } else {
           script.src = "http://ditu.google.cn/maps/api/js?&amp;libraries=places&amp;language=zh-cn&callback=mapInit";     
        }

        document.body.appendChild(script);  

      } 
    }
    else {

      if(this.connectivityService.isOnline()){
        this.initMap();
        this.enableMap();
      }
      else {
        this.disableMap();
      }

    }

    this.addConnectivityListeners();

  }

  initMap() {

    this.mapInitialised = true;

    Geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
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
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement, mapOptions);
     // google.maps.event.addListener(this.map, 'idle', () => { this.changeMap(this.selectOptions); });

      //this.mapLoadedObserver.next(true);
     
    });

  }
  getMap(){
    return this.map;
  }
  disableMap(): void {

    if(this.pleaseConnect){
      this.pleaseConnect.style.display = "block";
    }

  }

  enableMap(): void {

    if(this.pleaseConnect){
      this.pleaseConnect.style.display = "none";
    }

  }

  addConnectivityListeners(): void {

    document.addEventListener('online', () => {

      console.log("online");

      setTimeout(() => {

        if(typeof google == "undefined" || typeof google.maps == "undefined"){
          this.loadGoogleMaps();
        } 
        else {
          if(!this.mapInitialised){
            this.initMap();
          }

          this.enableMap();
        }

      }, 2000);

    }, false);

    document.addEventListener('offline', () => {

      console.log("offline");

      this.disableMap();

    }, false);

  }

  changeMarker(lat: number, lng: number): void {

    let latLng = new google.maps.LatLng(lat, lng);

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng
    });

    if(this.currentMarker){
      this.currentMarker.setMap(null);        
    }

    this.currentMarker = marker;  
      
  }

  


}