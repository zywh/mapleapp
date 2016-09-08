import {Modal, Loading, NavController, AlertController, NavParams, ViewController} from 'ionic-angular';
import { NgZone, Component} from '@angular/core';;
import {HouseDetailPage} from '../house-detail/house-detail';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {UserData} from '../../providers/user-data'
import {SelectOptionModal} from '../map-search/map-option-modal';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
import {AuthService} from '../../providers/auth/auth';
import {HouseList} from '../../components/house-list/house-list';

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
    templateUrl: 'build/pages/houselist-search/houselist-search.html',
    directives: [HouseList]

})
export class HouselistSearch {

    private totalCount: number;
    private imgHost;
    private bounds;
    private pageIndex: number = 0;
    private pageTotal: number = 1;
    private isList: boolean = true;
    //    // private selectOptions = {
    //         selectSR: true,
    //         selectBaths: 0,
    //         selectBeds: 0,
    //         selectHousesize: { lower: 0, upper: 4000 },
    //         selectLandsize: { lower: 0, upper: 43560 },
    //         selectPrice: { lower: 0, upper: 600 },
    //         selectType: '',
    //         selectListType: true,
    //         selectDate: 0

    //     }
    private selectOptions;
    private viewType: string = 'apps';
    private currentHouseList; //Hold list of all houses on current map

    constructor(
        private nav: NavController,
        private mapleRestData: MapleRestData,
        private parms: NavParams,
        private mapleConf: MapleConf,
        private userData: UserData,
        private auth: AuthService,
        private alertc: AlertController


    ) {

        this.selectOptions = parms.data.searchOptions;
        this.bounds = parms.data.bounds;
        this.currentHouseList = parms.data.list;
        this.imgHost = parms.data.imgHost;
        



    }



    //first time view is entered. add listener
    ionViewWillEnter() {
        if (!this.imgHost){
            this.getHouseList();
        }
       
    }
    ionViewDidEnter() {

    }

    ionViewLoaded() { }


    gotoHouseDetail(mls) {
        this.nav.pop().then(() => this.nav.push(HouseDetailPage, { id: mls, list: this.currentHouseList }))
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
            } else {
                infiniteScroll.complete();
            }
        }, 500);
    }

   toggleView() {
    this.isList = !this.isList;
    if (this.isList) {
      this.viewType ='apps';
    } else {
     this.viewType = 'list';
    }
  }

    getHouseList() {


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
     
        this.mapleConf.load().then(data => {
            let restUrl = data.getHouseList;
            this.mapleRestData.load(restUrl, searchParms).subscribe(
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


        })


    }



}