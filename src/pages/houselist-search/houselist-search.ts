import {Modal, Loading, NavController, AlertController, NavParams, ViewController, ActionSheetController, Events} from 'ionic-angular';
import { NgZone, Component} from '@angular/core';;
import {HouseDetailPage} from '../house-detail/house-detail';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {UserData} from '../../providers/user-data'
import {SelectOptionModal} from '../map-search/map-option-modal';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
import {AuthService} from '../../providers/auth/auth';
import {HouseList} from '../../components/house-list/house-list';


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
    private selectOptions;
    private viewType: string = 'apps';
    private sortType: string = 'Price';
    private sortOrder: number = 0;
    private listType: string;
    private currentHouseList; //Hold list of all houses on current map

    constructor(
        private nav: NavController,
        private mapleRestData: MapleRestData,
        private parms: NavParams,
        private mapleConf: MapleConf,
        private userData: UserData,
        private auth: AuthService,
        private alertc: AlertController,
        private events: Events,
        private actionc: ActionSheetController



    ) {

        this.selectOptions = parms.data.searchOptions;
        this.bounds = parms.data.bounds;
        this.currentHouseList = parms.data.list;
        this.imgHost = parms.data.imgHost;
        this.listType = parms.data.listType;
        this.listenEvents();

    }
    listenEvents() {

        this.events.subscribe('schoolmap:center', () => {
            this.nav.pop;
        });




    }


    //first time view is entered. add listener
    ionViewWillEnter() {
        if (this.listType = 'grid') {
            this.getHouseList();
        } else {
            this.totalCount = this.currentHouseList.length;
        }

    }


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
    sortAction() {


        let actionSheet = this.actionc.create({
            title: '排序',
            buttons: [
                {
                    text: '价格降序',
                    role: 'destructive',
                    handler: () => {
                        actionSheet.dismiss().then(res => {
                            this.sortType = 'Price';
                            this.sortOrder = 1;
                            this.sort();
                        })

                    }
                },
                {
                    text: '价格升序',
                    role: 'destructive',
                    handler: () => {
                        actionSheet.dismiss().then(res => {
                            this.sortType = 'Price';
                            this.sortOrder = 0;
                            this.sort();
                        })

                    }
                },
                {
                    text: '上市日期降序',
                    role: 'destructive',
                    handler: () => {
                        actionSheet.dismiss().then(res => {
                            this.sortType = 'ListDate';
                            this.sortOrder = 1;
                            this.sort();
                        })

                    }
                },
                {
                    text: '卧室降序',
                    role: 'destructive',
                    handler: () => {
                        actionSheet.dismiss().then(res => {
                            this.sortType = 'Beds';
                            this.sortOrder = 1;
                            this.sort();
                        })

                    }
                },


                {
                    text: '取消',
                    role: 'cancel',
                    handler: () => {

                    }
                }
            ]
        });

        actionSheet.present();


    }

    sort() {
        if (this.listType == 'house') {
            this.currentHouseList.sort(function (a, b) {
                let an, bn;
                if (this.sortType == 'ListDate') {
                    an = new Date(a.ListDate);
                    bn = new Date(b.ListDate);
                } else {
                    an = parseFloat(a[this.sortType]);
                    bn = parseFloat(b[this.sortType])
                }
                if (this.sortOrder == 0) { //ascend

                    return an - bn;
                } else {
                    return bn - an;
                }


            });
        } else { //grid view . Need run gethouse
            this.pageIndex = 0;  //reset pageIndex
            this.getHouseList();
        }

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
            this.viewType = 'apps';
        } else {
            this.viewType = 'list';
        }
    }

    getHouseList() {

        console.log(this.sortType);
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
            housedate: this.selectOptions.selectDate,
            sortType: this.sortType,
            sortOrder: this.sortOrder

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