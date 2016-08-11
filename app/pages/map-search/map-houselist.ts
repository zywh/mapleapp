import {NavParams, NavController, Events} from 'ionic-angular';
import {Component} from '@angular/core';
import {HouseDetailPage} from '../house-detail/house-detail';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
import {HouseList} from '../../components/house-list/house-list';


@Component({
    templateUrl: 'build/pages/map-search/map-houselist.html',
    directives: [HouseList]

})
export class MapHouselist {

    private currentHouseList;
    private imgHost;

    constructor(
        private params: NavParams,
        private nav: NavController,
        private mapleConf: MapleConf

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


}