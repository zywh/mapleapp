import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavParams, NavController} from 'ionic-angular';
import {HouseDetailPage} from '../house-detail/house-detail';

@Component({
    templateUrl: 'build/pages/map-search/house-popover.html'
})

export class HousePopover {
    private house;
    private currentHouseList;
    private imgHost;
    constructor(private navparms: NavParams, private nav: NavController) {
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

