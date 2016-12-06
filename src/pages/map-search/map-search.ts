import { Content, NavController, NavParams, Events } from 'ionic-angular';

import { Component, ViewChild } from '@angular/core';;
// import { Connectivity } from '../../providers/connectivity';
// import { HouseDetailPage } from '../house-detail/house-detail';
// import { HouselistSearch } from '../houselist-search/houselist-search';
import { MapleConf } from '../../providers/maple-rest-data/maple-config';
//import { MapleRestData } from '../../providers/maple-rest-data/maple-rest-data';

//import { SelectOptionModal } from './map-option-modal';
//import { MapHouselist } from './map-houselist';

//import { SchoolSelectOptionModal } from '../school-map/schoolmap-option-modal';
//import { SchoolListModal } from '../school-map/school-list-modal';

//import { AuthService } from '../../providers/auth/auth';
//import { UserData } from '../../providers/user-data';
//import { houseListModel } from '../../models/houseListModel';

@Component({
  selector: 'page-map',
  templateUrl: 'map-search.html'
})


export class MapSearchPage {

  //@ViewChild('map') public mapElement: ElementRef;
  // @ViewChild('mapCanvas') mapElement: ElementRef;
  tabBarElement: any;
  @ViewChild(Content) content: Content;
  public mapInitialised: boolean = false;
  public center;

  public mapType: number = 1; // 0 for house and 1 for school
  //public markerDrop;
  public lockMapListener: boolean = false;
  public simpleMap: boolean = false;


  constructor(
    public nav: NavController,
    // private auth: AuthService,
    // public platform: Platform,
    // private mapleRestData: MapleRestData,
    // private userData: UserData,
    // public connectivityService: Connectivity,
    // private menu: MenuController,
    private mapleconf: MapleConf,
    private navparm: NavParams,
    // private _zone: NgZone,
    // private viewCtrl: ViewController,
    // private alertc: AlertController,
    // private modalc: ModalController,
    // private loadingc: LoadingController,
    // private popoverc: PopoverController,
    private events: Events
  ) {


    this.mapType = this.navparm.data.pageType;

    console.log(this.navparm);
    console.log(this.mapType);
    //this.resetItems();

    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    // this.listenEvents();

  }

  // listenEvents() {
  //   this.events.subscribe('locate:dismiss', () => {
  //     this.locateLock = false;
  //     this.lockMapListener = false;
  //     this.setLocation(this.defaultcenter, this.defaultZoom, true);
  //   });
  //   this.events.subscribe('schoolmap:center', () => {
  //     // console.log("List modal dismiss")
  //     this.listModal.dismiss();
  //   });
  //   this.events.subscribe('user:login', (data) => {


  //   })
  //   this.events.subscribe('user:logout', (data) => {
  //     this.resetSelections();
  //     //this.changeMap(this.mapType);

  //   })




  // }

  // initMap() {
  //   console.log("init map" + this.mapType);

  //   this.mapInitialised = true;
  //   //let mapEle = this.mapElement.nativeElement;

  //   // let loading = this.loadingc.create({
  //   //   content: '加载地图...'
  //   // });
  //   //loading.present();


  //   //let mapEle = document.getElementById('map');
  //   this.mapleconf.getLocation().then(data => {
  //     console.log(data);
  //     console.log(this.mapElement.nativeElement);
  //     this.defaultcenter = new google.maps.LatLng(data['lat'], data['lng']);
  //     //this.defaultcenter = this.mapLatLng(data['lat'], data['lng']);

  //     if (this.navparm.data.parms.lat > 20) {
  //       // console.log("Redirect from other page with center");
  //       this.defaultcenter = new google.maps.LatLng(this.navparm.data.parms.lat, this.navparm.data.parms.lng);
  //       //this.defaultcenter = this.mapLatLng(data['lat'], data['lng']);
  //     }


  //     let mapOptions = {
  //       //center: latLng,
  //       center: this.defaultcenter,
  //       minZoom: 4,
  //       controls: {
  //         'compass': true,
  //         'myLocationButton': true,
  //         'indoorPicker': true,
  //         'zoom': true
  //       },
  //       mapTypeControl: true,
  //       mapTypeControlOptions: {
  //         style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
  //         position: google.maps.ControlPosition.TOP_LEFT
  //       },
  //       zoomControl: true,
  //       zoomControlOptions: {
  //         position: google.maps.ControlPosition.RIGHT_TOP
  //       },
  //       scaleControl: true,
  //       streetViewControl: true,
  //       streetViewControlOptions: {
  //         position: google.maps.ControlPosition.TOP_RIGHT
  //       },
  //       zoom: 14,
  //       mapTypeId: google.maps.MapTypeId.ROADMAP
  //     }

  //     console.log(mapOptions);
  //     console.log(this.mapElement.nativeElement);

  //     this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  //     //loading.dismiss();

  //     google.maps.event.addListenerOnce(this.map, 'idle', () => {
  //       this.mapElement.nativeElement.classList.add('show-map');
  //     });
  //     google.maps.event.addListener(this.map, 'idle', () => {
  //       this.changeMap(this.mapType);
  //     });




  //     //Add marker if it's redirected from school page
  //     // console.log(this.navparm.data.parms.type);
  //     if (this.navparm.data.parms.type != 'NONE') {

  //       this.setLocation(this.defaultcenter, 13, this.navparm.data.parms.type)
  //     }


  //   });


  // }



  ionViewWillEnter() {
    console.log("Map View will enter");
    this.content.resize(); //resize to have fab position after housedetail page is back
    this.lockMapListener = false; //unlock after view enter  
    // this.center = {'lat':43,'lng':-79};

    if (this.navparm.data.parms.lat > 20) {
      this.center = { 'lat': this.navparm.data.parms.lat, 'lng': this.navparm.data.parms.lng, 'type': 1 };
    } else {

      if (this.mapleconf.location) {
        console.log("location exist");
        this.center = { 'lat': this.mapleconf.location.lat, 'lng': this.mapleconf.location.lng, 'type': 0 };
      } else {

        this.mapleconf.getLocation().then(data => {
          console.log("Get current location");
          console.log(data);

          this.center = { 'lat': data['lat'], 'lng': data['lng'], 'type': 0 };

        })

      }

    }


    // let optionType = (this.mapType == 0) ? 'houseSearch' : 'schoolSearch';

    // if (this.auth.authenticated()) {
    //   this.userData.getUserSelections(optionType).then(res => {
    //     if (res != null) {
    //       this.selectOptions = res;
    //     }

    //   })
    // }



  }

  ionViewDidLoad() {
    // ionViewDidEnter() {

    if (this.nav.length() > 1) this.tabBarElement.style.display = 'none';

  }

  ionViewDidLeave() {
    //console.log("Map view did leave")
    this.lockMapListener = true; //lock change map after view switch. workaround for android searchbar trigger map data refresh
  }





}


