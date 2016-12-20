import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { ModalController, Events, AlertController, NavController, NavParams, ViewController } from 'ionic-angular';
import { Connectivity } from '../../providers/connectivity';
import { HouseDetailPage } from '../../pages/house-detail/house-detail';
import { HouselistSearch } from '../../pages/houselist-search/houselist-search';
import { MapleConf } from '../../providers/maple-rest-data/maple-config';
import { MapleRestData } from '../../providers/maple-rest-data/maple-rest-data';
import { SelectOptionModal } from './map-option-modal';
import { SchoolSelectOptionModal } from '../../pages/school-map/schoolmap-option-modal';
import { SchoolListModal } from '../../pages/school-map/school-list-modal';
import { AuthService } from '../../providers/auth/auth';
import { UserData } from '../../providers/user-data';
import { houseListModel } from '../../models/houseListModel';
//import { HouseDetailTabsPage } from '../../pages/house-detail-tabs/house-detail-tabs';


declare var RichMarker: any;
declare var google: any;

/*
  Generated class for the MapleMapSearch component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
    selector: 'maple-map-search',
    templateUrl: 'maple-map-search.html'
})
export class MapleMapSearchComponent {
    @ViewChild('maplemap') mapElement: ElementRef;
    @Input() mapType: number = 0; // 0 = house, 1=school
    @Input() lockMapListener: boolean = false; // false= allow changeMap to refresh, true= changeMap is locked
    @Input() center; // // center: object  = {'lat':lat,'lng':lng,'type': type}  ,type  0 = no marker drop, 1= house marker ,2= school marker 
    @Input() simpleMap: boolean = true; // true = no button , false = display button
    @Input() zoomlevel; // community


    public mapLib = 1; // 0 is java and 1 is native google SDK
    public mapInitialised: boolean = false;
    public parms: Object;

    public defaultcenter;
    public houselist: any;
    public map = null;
    //public center;
    public markerArray = [];
    public htmlArray = [];
    // public mviewLoaded: boolean = false;
    public htmlArrayPosition = 0;
    public totalCount: number; //Returned House
    public listAllHtml = ''; //hold houses on current map
    //public isListShow: boolean = false;
    public markerType;
    public imgHost: String;
    //public listModal: ViewController;
    public listModal;
    public defaultZoom: number = 14;
    public _bounds;
    public locateLock: boolean = false; //lock location button if there is input popup
    public schoolList: Array<any>;

    public selectOptions;
    public optionPage;
    public savedOptions;
    public currentHouseList: houseListModel; //Hold list of all houses on current map
    public currentHouses; //Hold array of houses for single marker
    public currentDiv;
    //public mapType: number = 1; // 0 for house and 1 for school
    public markerDrop;

    //public lockMapListener: Boolean = false;


    constructor(
        public nav: NavController,
        private auth: AuthService,
        // public platform: Platform,
        private mapleRestData: MapleRestData,
        private userData: UserData,
        public connectivityService: Connectivity,
        // private menu: MenuController,
        private mapleconf: MapleConf,
        private navparm: NavParams,

        private viewCtrl: ViewController,
        private alertc: AlertController,
        private modalc: ModalController,
        // private loadingc: LoadingController,
        // private popoverc: PopoverController,
        private events: Events
    ) {




    }

    listenEvents() {
        this.events.subscribe('locate:dismiss', () => {
            this.locateLock = false;
            this.lockMapListener = false;
            this.setLocation(this.defaultcenter, this.defaultZoom, 1);
        });
        this.events.subscribe('schoolmap:center', () => {
            // console.log("List modal dismiss")
            this.listModal.dismiss();
        });
        this.events.subscribe('user:login', (data) => {


        })
        this.events.subscribe('user:logout', (data) => {
            this.resetSelections();
            //this.changeMap(this.mapType);

        })




    }



    initMap(point, centerMarker: number) {  // 1 = drop a house marker, 2 = drop a school marker

        this.mapInitialised = true;

        let mapOptions = {
            //center: latLng,
            center: point,
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
            zoom: this.zoomlevel ? this.zoomlevel : 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }




        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);


        google.maps.event.addListener(this.map, 'idle', () => {
            console.log("add map listener");
            this.changeMap(this.mapType);
        });



        if (centerMarker > 0) {   // 0 = no marker drop, 1= house marker ,2= school marker 

            this.setLocation(point, this.zoomlevel ? this.zoomlevel : this.defaultZoom, this.center.type);
        }



    }







    openModal() {
        this.lockMapListener = true;

        let modal = this.modalc.create(this.optionPage, { data: this.selectOptions, type: this.mapType, searchflag: true });
        modal.onDidDismiss(data => {
            this.selectOptions = data;
            this.lockMapListener = false;

            this.changeMap(this.mapType);


            if (this.selectOptions.hasOwnProperty("selectSearch")) { //avoid no lat error
                if (this.selectOptions.selectSearch.lat > 20) {  //change location 
                    //let point = new google.maps.LatLng(this.selectOptions.selectSearch.lat, this.selectOptions.selectSearch.lng);
                    let point = {lat:this.selectOptions.selectSearch.lat,lng:this.selectOptions.selectSearch.lng};

                    this.setLocation(point, this.defaultZoom, 1);

                }
            }






        });

        modal.present();


    }



    getResult(url) {
        this.mapleRestData.load(url, this.parms).subscribe(
            data => { this.houselist = data.Data; }

        )
    }




    gotoHouseDetail(mls) {
        this.nav.push(HouseDetailPage, { id: mls, list: this.currentHouseList.list });
        // this.nav.push(HouseDetailTabsPage,{ id: mls, list: this.houselist.list });   //house detail tabs view
    }

    openList(ev) {


        if (this.mapType == 0) {


            if ((this.markerType == 'house') && (this.totalCount > 0)) {

                this.nav.push(HouselistSearch, { list: this.currentHouseList, imgHost: this.imgHost, listType: 'house' });

            } else {

                this.nav.push(HouselistSearch, { searchOptions: this.selectOptions, bounds: this._bounds, listType: 'grid' });


            }
        } else {

            // let modal = this.modalc.create(SchoolListModal, { data: this.schoolList });
            // modal.present();
            this.nav.push(SchoolListModal, { data: this.schoolList });
        }

    }

    //select autocomplete action

    setMapType(type) {

        if (type == 0) {
            //init house page parm
            this.selectOptions = {
                selectSR: true,
                selectOH: false,
                selectBaths: 0,
                selectBeds: 0,
                selectHousesize: { lower: 0, upper: 4000 },
                selectLandsize: { lower: 0, upper: 43560 },
                selectPrice: { lower: 0, upper: 500 },
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
    setmapCenter(isMarker) {
        //this.lockMapListener = true; // lock listener to prevent Android map listener trigger
        //this.locateLock = true; //lock locate click to prevent frozen from double click

        this.mapleconf.getLocation().then(data => {

            //this.defaultcenter = new google.maps.LatLng(data['lat'], data['lng']);
            this.defaultcenter = {lat:data['lat'],lng:data['lng']};
             this.setLocation(this.defaultcenter, this.defaultZoom, 1);
            // if (this.auth.authenticated()) {
            //     //this.userData.addCenterAlert(data['lat'], data['lng'], "保存中心位置到我的收藏");


            //     // this.userData.addCenterAlert(data['lat'], data['lng'], "保存中心位置到我的收藏").then(res=>{
            //     //  this.setLocation(this.defaultcenter, this.defaultZoom, isMarker);
            //     //  this.lockMapListener = false;

            //     //});
            // } else {
            //     this.locateLock = false;
            //     this.setLocation(this.defaultcenter, this.defaultZoom, 1);
            //     this.lockMapListener = false;
            // }


        })
    }

    // //Move to center and creata a marker
    setLocation(point, zoom, centerType) {
        let center = new google.maps.LatLng(point['lat'], point['lng']);
        this.map.setZoom(zoom);
        this.map.setCenter(center);
        if (this.markerDrop != null) {
            this.markerDrop.setMap(null);
        }
        this.addCenterMarer(center, centerType);
    }


    addCenterMarer(point, type) {

        let iconbase = "assets/img/maple/";
        let iconurl;
        iconurl = iconbase + "city.png";
        if (type == 2) iconurl = iconbase + "university.png";

        if (type == 1) iconurl = iconbase + "bighouse.png";

        console.log("drop marker" + type + "url:" + iconurl);
        this.markerDrop = new google.maps.Marker({
            position: point,
            map: this.map,
            animation: google.maps.Animation.DROP,
            draggable: false,
            icon: iconurl
        });
        this.markerDrop.addListener('click', () => {
            if (this.markerDrop.getAnimation() !== null) {
                this.markerDrop.setAnimation(null);
            } else {
                this.markerDrop.setAnimation(google.maps.Animation.BOUNCE);
            }
        })

    }


    setContent(lat, lng, count, html, houses, price, house, vowflag) {
        let point = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
        //let content = this.setMarkerCss(count, price);
        // console.log("Set House Content Marker")
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
                // let text = (vowflag)? 
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
                            text: (vowflag) ? '详情' : '登录',
                            handler: () => {
                                //let navTransition = alert.dismiss();
                                // navTransition.then(() => {
                                //this.nav.pop();
                                alert.dismiss();
                                if (vowflag) {
                                    // this.nav.push(HouseDetailPage, { id: house.MLS, list: this.currentHouseList.list });
                                    //this.nav.push(HouseDetailTabsPage,{ id: house.MLS, list: this.houselist.list });  
                                    this.gotoHouseDetail(house.MLS);
                                } else {
                                    this.userData.loginAlert();
                                }

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
                // console.log("More than one");
                this.nav.push(HouselistSearch, { list: this.currentHouseList, imgHost: this.imgHost, listType: 'house' });

            }


        });


    }
    setSchoolContent(lat, lng, html, rating) {
        //console.log("Set School Marker Content")
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
                        //this.nav.parent.switch(2);
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
            //this.map.setCenter(this.position);
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

        console.log("change map" + type + "Listenerlock:" + this.lockMapListener);
        if (this.lockMapListener == false) {
            console.log("loading map data:" + type);
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
            //let centerlat = (_ne.lat() + _sw.lat()) / 2;
            //let centerlng = (_ne.lng() + _sw.lng()) / 2;
            // let HouseArray = [];


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
                    oh: this.selectOptions.selectOH,
                    housebaths: this.selectOptions.selectBaths,
                    houseroom: this.selectOptions.selectBeds,
                    housearea: this.selectOptions.selectHousesize,
                    houseground: this.selectOptions.selectLandsize,
                    housedate: this.selectOptions.selectDate

                };
            }

            // console.log("Map House Search Parms:" + mapParms);
            this.mapleconf.load().then(data => {

                let restUrl = data.mapHouseRest;
                if (type == 1) {
                    restUrl = data.getSchoolmapDataRest;
                }
                this.mapleRestData.load(restUrl, mapParms).subscribe(
                    data => {
                        //console.log("MapType:" + type)
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
            //let listAllHtml;
            //this.currentHouseList = this.userData.setVowMask(data.Data.HouseList);
            this.currentHouseList = new houseListModel(data.Data.HouseList, this.auth.authenticated());
            let panelhtml;
            // console.log("Current House List Length:" + this.currentHouseList.length);

            // console.log('Image Host:' + this.imgHost);
            for (let index = 0, l = totalhouse; index < l; index++) {
                let house = data.Data.HouseList[index];


                if (index < (totalhouse - 1)) {
                    nextLat = data.Data.HouseList[index + 1].GeocodeLat;
                    nextLng = data.Data.HouseList[index + 1].GeocodeLng;

                }

                //let hprice = (house.SaleLease == 'Lease') ? Math.round(house.Price) * 10000 + '加元/月' : Math.round(house.Price) + '万加元';
                let markerprice = Math.round(house.Price);

                let tlat = parseFloat(house.GeocodeLat);
                let tlng = parseFloat(house.GeocodeLng);
                //let vowflag: Boolean = ( house.src == 'VOW' || this.auth.authenticated());
                // console.log("MLS:"+ house.MLS + " SRC:" + house.src + " isAuth:" + this.auth.authenticated());
                let vowflag: boolean = (!this.auth.authenticated() && house.Src == 'VOW') ? false : true;

                let li: String;
                if (!vowflag) {
                    // console.log("MLS:" + house.MLS + "VOW Hide DATA");
                    li = "<h2>登录用户可见</h2>"
                } else {

                    //console.log("MLS:" + house.MLS + "NOT VOW DATA");
                    li = ' <ion-card>'
                        + '<img src="' + house.CdnCoverImg + '" />'
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
                }

                if ((nextLng != house.GeocodeLng) || (nextLat != house.GeocodeLat)) {

                    if (count == 1) {

                        houses.push(house);

                        this.setContent(tlat, tlng, 1, li, house, markerprice, house, vowflag);
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
                        this.setContent(tlat, tlng, count, panelhtml, houses, price, house.MLS, true);
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

    resetSelections() {
        this.selectOptions = {
            selectSR: true,
            selectOH: false,
            selectBaths: 0,
            selectBeds: 0,
            selectHousesize: { lower: 0, upper: 4000 },
            selectLandsize: { lower: 0, upper: 43560 },
            selectPrice: { lower: 0, upper: 500 },
            selectType: '',
            selectListType: true,
            selectDate: 0,
            selectSearch: {}

        }


    }

    // ngOnInit(){
    //   this.simpleMap = true;
    // }



    ngOnChanges(changes) {

        //  console.log('maple-map-search ngonchanges:' + this.mapType + "localListener:" + this.lockMapListener);

        //console.log(this.center);

        //if (this.mapInput && !this.mapInitialised) {

        // no init if this.center doesn't exist
        //no init if mapinit is done once and no simplemap

        // if (this.center && (!this.mapInitialised || this.simpleMap)) {
        // let centerChange: boolean = false;
        // console.log("map ngchanges");
        // console.log(changes);

        // // for (let propName in changes) {
        // //     let chng = changes[propName];
        // let cur = JSON.stringify(changes['center'].currentValue);
        // let prev = JSON.stringify(changes['center'].previousValue);
        // // console.log('ngOnChanges property ' + propName + " prev value:" + prev + " current value:" + cur);
        // //if (propName == 'center' && cur != prev) {
        // if (cur != prev) {
        //     console.log('ngOnChanges property ');
        //     centerChange = true;
        // }

        console.log("map init" + this.mapInitialised)
        if ((this.center && !this.mapInitialised)) {


            console.log('maple-map-search map init');

            this.setMapType(this.mapType);
            this.listenEvents();

            //this.initMap(point, this.center['type']);
            this.loadGoogleMaps();
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


        }




    }

    loadGoogleMaps() {


        if (typeof google == "undefined" || typeof google.maps == "undefined") {

            console.log("Google maps JavaScript needs to be loaded.");

            if (this.connectivityService.isOnline()) {
                console.log("online, loading map.....");
                this.connectivityService.loadJs().then(() => {
                 
                   
                    this.initMap(this.center, this.center['type']);

                });

          
            }
        }
        else {

            if (this.connectivityService.isOnline()) {
                console.log("showing map");
                //let point = new google.maps.LatLng(this.center['lat'], this.center['lng']);

                this.initMap(this.center, this.center['type']);
            }


        }

    }




    initTestMap() {

        console.log(this.center);
        console.log(this.mapElement.nativeElement);
        let point = new google.maps.LatLng(this.center['lat'], this.center['lng']);
        let mapOptions = {
            //center: latLng,
            center: point,
            minZoom: 4,
            zoom: 14,
            //draggable: false,
            //scrollwheel: false,
            // navigationControl: false,
            // mapTypeControl: false,
            // scaleControl: false,
            //draggable: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        let map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        new google.maps.Marker({
            position: point,
            map: map,
            animation: google.maps.Animation.DROP,
            draggable: false,
        });


    }




}
