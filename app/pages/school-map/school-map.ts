import {ModalController, LoadingController, AlertController, Events, MenuController, Platform, NavController, NavParams, Page, ViewController} from 'ionic-angular';
//import {Geolocation} from 'ionic-native';
import { NgZone, Component, ViewChild} from '@angular/core';;
import {MapSearchPage} from '../map-search/map-search';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
import {SelectOptionModal} from './schoolmap-option-modal';
import {SchoolListModal} from './school-list-modal';
//import {ConferenceData} from '../../providers/conference-data';
//import {TabsPage} from '../tabs/tabs';
declare var RichMarker: any;

interface schoolSelectOptionsObj {
    selectType?: Boolean,
    selectRank?: Number,
    selectPingfen?: Number,
    selectXingzhi?: String
}

@Component({
    templateUrl: 'build/pages/school-map/school-map.html',

})


export class SchoolMapPage {

    private searchQuery: String = '';
    private cityItems: any;
    private schoolItems: any;
    private parms: Object;
    private map;
    private center;
    private schoolDropMarker;
    private defaultcenter = new google.maps.LatLng(43.6532, -79.3832);
    private markerArray = [];
    private sMarkerArray = [];
    private sviewLoaded: Boolean = false;
    private defaultZoom: Number = 13;
    //private htmlArray = [];
    private htmlArrayPosition = 0;
    //private totalCount: Number; //Returned House

    private schoolList: Array<any>;
    private markerType;


    private selectSchool: schoolSelectOptionsObj = {
        selectPingfen: 0,
        selectRank: 0,
        selectType: false,
        selectXingzhi: ''

    }

    private currentDiv;

    constructor(
        private nav: NavController,
        private mapleRestData: MapleRestData,
        //private confData: ConferenceData,
        private mapleconf: MapleConf,
        private _zone: NgZone,
        private alertc: AlertController,
        private modalc: ModalController,
        private loadingc: LoadingController,
        private viewCtrl: ViewController,
        private events: Events
    ) {

        this.resetItems();
        this.loadRichMarker(); //Load richmarker after googlemap. Check network connection to avoid blank page
        this.listenEvents();

    }


    loadRichMarker() {


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
        let modal = this.modalc.create(SelectOptionModal, { data: opt });
        modal.onDidDismiss(data => {
            this.selectSchool = data;
            this.changeMap();
        });
        modal.present();
    }


    //init map. It only once 
    ionViewLoaded() {

        setTimeout(() => {
            console.log("View Loaded init map")
            let mapEle = document.getElementById('schoolmap');

            this.map = new google.maps.Map(mapEle, {
                //center: mapData.find(d => d.center),
                center: this.defaultcenter,
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
                zoom: 10
            });

        }, 50); //wait for switch to avoid blank map

    }

    //load map listener if first time
    ionViewWillEnter() {

        if (!this.sviewLoaded) {
            console.log("School Map View will enter. Add school map Listener");
            setTimeout(() => {
                google.maps.event.addListener(this.map, 'idle', () => { this.changeMap(); });
                google.maps.event.addListener(this.map, 'click', () => {
                    this._zone.run(() => {
                        this.searchQuery = '';
                        this.currentDiv = '';
                    });

                });

                this.sviewLoaded = true;
            }, 100); //Set timeout to load it after mapinit
        }
    }

    //Add marker only if first time or marker
    ionViewDidEnter() {
        //console.log("School Map View did entered");
        if ((this.markerArray.length == 0) && (!this.sviewLoaded)) {
            setTimeout(() => {
                //console.log("School Map is entered No marker First Time. Zoom and center")
                this.map.setZoom(13);
                this.setCenter(false);
            }, 300);
        }

    }

    listenEvents() {
        this.events.subscribe('schoolmap:center', (data) => {

            setTimeout(() => {
                this.sviewLoaded = true;
                //this.nav.pop();
                this.setLocation(data[0], this.defaultZoom, true);
            }, 200);
        });
    }

    setCenter(isMarker) {

        this.mapleconf.getLocation().then(data => {
            this.defaultcenter = new google.maps.LatLng(data['lat'], data['lng']);
            this.setLocation(this.defaultcenter, this.defaultZoom, isMarker);
        })



    }

    openSchoolList() {
        //console.log(this.schoolList);

        let modal = this.modalc.create(SchoolListModal, { data: this.schoolList });
        modal.onDidDismiss(data => {
            //this.selectSchool = data;

        });
        modal.present();

    }

    resetItems() {
        this.cityItems = [];
        this.schoolItems = [];
        //this.addressItems = [];

    }


    itemTapped(event, item, type) {

        let center = new google.maps.LatLng(item.lat, item.lng);
        this.setLocation(center, 14, true);
        this.resetItems();

    }
    //auto complete REST CAll
    getItems(searchbar) {

        this.resetItems();
        this.currentDiv = 'schoolList';

        if (this.searchQuery == '') {
            return;
        } else {
            let parm = { term: this.searchQuery };
            //Call REST and generate item object
            this.mapleconf.load().then(data => {
                this.mapleRestData.load(data.getSchoolAcDataRest, parm).subscribe(
                    // this.mapleRestData.load('index.php?r=ngget/getSchoolAutoComplete', parm).subscribe(
                    data => {
                        if (data.hasOwnProperty("CITY")) {
                            this.cityItems = data.CITY;

                        };

                        if (data.hasOwnProperty("SCHOOL")) {
                            this.schoolItems = data.SCHOOL;

                        }

                    }); //end of callback
                //this.items = ["city", "address", "MLS"];

            });
        }

    }
    //SetCenter and Zoom
    setLocation(center, zoom, isMarker) {
        this.map.setCenter(center);
        this.map.setZoom(zoom);
        if (isMarker) {
            this.clearAll(this.sMarkerArray);

            let marker = new google.maps.Marker({
                position: center,
                map: this.map,
                draggable: false,

            });
            this.sMarkerArray.push(marker);
        }
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

        marker.addListener('click', () => {

            let alert =this.alertc.create({
                title: '学校简介',
                message: html,
                cssClass: 'school_popup',
                buttons: [{ text: '取消', role: 'cancel' },
                    {
                        text: '周边房源',
                        handler: () => {
                            this.events.publish('map:center', point);
                            //this.nav.push(MapSearchPage);
                        }
                    }
                ]
            });
            alert.present();
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
    clearAll(ma) {
        if (ma.length > 0) {
            for (let i in ma) {
                ma[i].setMap(null);
            }
            ma.length = 0;
        }
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

        this.clearAll(this.markerArray); //clear marker
        let loading = this.loadingc.create({
            content: '加载学校...'
        });
       loading.present();



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
        this.mapleconf.load().then(data => {
            this.mapleRestData.load(data.getSchoolmapDataRest, mapParms).subscribe(
                //this.mapleRestData.load('index.php?r=ngget/getSchoolmap', mapParms).subscribe(
                data => {
                    loading.dismiss();
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
                                + "<p text-left>排名：<ion-badge>" + rank + "</ion-badge> 评分：<ion-badge>" + rating + "</ion-badge></p>";

                            this.setContent(tlat, tlng, html, rating);

                        }
                    } //End of if HOUSE
                });
        });
        //END of Data Subscribe

    }

    //End of MAP import function

}

