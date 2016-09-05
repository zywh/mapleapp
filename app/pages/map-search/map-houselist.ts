import {NavParams, NavController, Events} from 'ionic-angular';
import {Component} from '@angular/core';
import {HouseDetailPage} from '../house-detail/house-detail';
import {Modal, Loading, AlertController, ViewController} from 'ionic-angular';
import { NgZone} from '@angular/core';;
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {UserData} from '../../providers/user-data'
import {SelectOptionModal} from '../map-search/map-option-modal';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
import {AuthService} from '../../providers/auth/auth';
//import {HouseList} from '../../components/house-list/house-list';



@Component({
    templateUrl: 'build/pages/map-search/map-houselist.html',
    

})
export class MapHouselist {

    private currentHouseList;
    private imgHost;
    private listHouse: Boolean = false;
    private listFav: Boolean = true;


    constructor(
        private params: NavParams,
        private nav: NavController,
        private mapleConf: MapleConf,
        private userData: UserData

    ) {
        //this.viewCtrl = viewCtrl;
        console.log(this.params.data);
        this.currentHouseList = this.params.data.list;
        this.imgHost = this.params.data.imgHost;

    }

    gotoHouseDetail(mls) {
        this.nav.pop().then(() => this.nav.push(HouseDetailPage, { id: mls, list: this.currentHouseList }));

    }



    close() {
        this.nav.pop();
    }
    
    addFav(mls,type){
        this.userData.favWrapper(mls,type).then(res=>{
            //this.nav.pop();
        });
    }


}