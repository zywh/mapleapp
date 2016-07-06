import {Modal, Loading, NavController, NavParams, ViewController} from 'ionic-angular';
import { NgZone, Component} from '@angular/core';;
import {HouseDetailPage} from '../house-detail/house-detail';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {SelectOptionModal} from '../map-search/map-option-modal';

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
    templateUrl: 'build/pages/houselist-search/houselist-search.html'

})
export class HouselistSearch {


    private queryText: String = '';
    private totalCount: Number;
    private cityItems: any;
    private addressItems: any;
    private mlsItems: any;
    private currentDiv;
    private imgHost;
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

    constructor(
        private nav: NavController,
        private mapleRestData: MapleRestData


    ) {

        console.log(this.selectOptions);
        this.resetItems();


    }



    openModal(opt) {
        let modal = Modal.create(SelectOptionModal, { data: opt });
        modal.onDismiss(data => {
            this.selectOptions = data;
            console.log(this.selectOptions);
            this.getHouseList();
        });
        this.nav.present(modal);
    }

    //first time view is entered. add listener
    ionViewWillEnter() {
        this.getHouseList();
    }
    ionViewDidEnter() {
        console.log("Map View did entered");


    }

    // getResult(url) {
    //     this.mapleRestData.load(url, this.parms).subscribe(
    //         data => { this.currentHouseList = data.Data; }

    //     )
    // }

    // initial view is loaded by tab page with 100ms delay
    ionViewLoaded() { }


    gotoHouseDetail(mls) {
        this.nav.push(HouseDetailPage, { id: mls, list: this.currentHouseList });
    }


    //select autocomplete action
    resetItems() {
        this.cityItems = [];
        this.addressItems = [];
        this.mlsItems = [];
        //this.searchQuery = '';
    }


    itemTapped(event, item, type) {

        // let center = new google.maps.LatLng(item.lat, item.lng);
        // this.setLocation(center, this.defaultZoom, true);
        this.resetItems();


    }
    //auto complete REST CAll
    getItems(searchbar) {

        this.resetItems();
        this.currentDiv = 'searchlist';
        if (this.queryText == '') {
            return;
        } else {
            let parm = { term: this.queryText };
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

        }
    }

    getHouseList() {
        console.log("Get House List");
        this.currentDiv = ''; //reset all popup

        // let loading = Loading.create({
        //   content: '加载房源...'
        // });
        // this.nav.present(loading);


        let HouseArray = [];
        let searchParms = {
            sr: (this.selectOptions.selectSR == true) ? 'Sale' : 'Lease',
            housetype: this.selectOptions.selectType,
            houseprice: this.selectOptions.selectPrice,
            houseroom: this.selectOptions.selectBeds,
            housearea: this.selectOptions.selectHousesize,
            houseground: this.selectOptions.selectLandsize,
            housedate: this.selectOptions.selectDate

        };
        //console.log("Map House Search Parms:" + mapParms);
        this.mapleRestData.load('index.php?r=ngget/getHouseList', searchParms).subscribe(
            data => {
                //loading.dismiss();
                this.totalCount = data.Data.Total;
                let houses = [];
                let totalprice = 0;
                let totalhouse = data.Data.HouseList.length;
                this.imgHost = data.Data.imgHost;
                this.currentHouseList = data.Data.HouseList;
                console.log("Current House List Length:" + this.currentHouseList);

            });

        //END of Data Subscribe

    }

    //End of MAP import function




}