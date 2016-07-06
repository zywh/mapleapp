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
    private totalCount: number;
    private cityItems: any;
    private addressItems: any;
    private mlsItems: any;
    private currentDiv;
    private imgHost;
    private bounds;
    private pageIndex: number = 0;
    private pageTotal: number = 1;
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
        private mapleRestData: MapleRestData,
        private parms: NavParams


    ) {

        this.selectOptions = parms.data.opts;
        this.bounds = parms.data.bounds;
        console.log(this.selectOptions);

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
    pagePre() {
        --this.pageIndex;
        this.getHouseList();
    }

    pageNext() {
        ++this.pageIndex;
        
        this.getHouseList();
    }
    doInfinite(infiniteScroll) {
        setTimeout(() => {
            if (this.pageIndex < this.pageTotal - 1) {
                ++this.pageIndex;
                this.getHouseList();
                infiniteScroll.complete();
            }else {
                 infiniteScroll.complete();
            }
        }, 500);
    }


    getHouseList() {
       
        this.currentDiv = ''; //reset all popup

        // let loading = Loading.create({
        //   content: '加载房源...'
        // });
        // this.nav.present(loading);


        let HouseArray = [];
        let searchParms = {
            bounds: this.bounds,
            pageindex: this.pageIndex,
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
                this.pageTotal = Math.ceil(this.totalCount / 8);
                let houses = [];
                let totalprice = 0;
                let totalhouse = data.Data.HouseList.length;
                this.imgHost = data.Data.imgHost;
                this.currentHouseList = data.Data.HouseList;
               
            });

        //END of Data Subscribe

    }

    //End of MAP import function




}