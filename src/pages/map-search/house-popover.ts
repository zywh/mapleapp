import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavParams, NavController} from 'ionic-angular';
import {HouseDetailPage} from '../house-detail/house-detail';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';

@Component({
    templateUrl: 'house-popover.html'
})

export class HousePopover {
    public house;
    public currentHouseList;
    public imgHost;
    constructor(private navparms: NavParams, private nav: NavController,private mapleConf: MapleConf) {
        this.house = this.navparms.data.house;
        this.currentHouseList = this.navparms.data.list;
        this.imgHost = this.navparms.data.imgHost;

    }

    gotoHouseDetail(mls) {
        this.nav.pop().then(() => this.nav.push(HouseDetailPage, { id: mls, list: this.currentHouseList }))
    }


    close() {
        this.nav.pop();
    }

}

