import {NavParams, ViewController, NavController} from 'ionic-angular';
import {Component} from '@angular/core';
import {HouseDetailPage} from '../house-detail/house-detail';


@Component({
    templateUrl: 'build/pages/map-search/map-houselist.html'

})
export class MapHouselist {

    private currentHouseList;
    private imgHost;
    private swiperOptions = {
        //loop: true,
        //pager: true,
        //speed: 4000,
        spaceBetween: 20,
        slidesPerView: 'auto',
        //loopedSlides: 10
        autoplay: 3000
    };

    constructor(

        private params: NavParams,
        private nav: NavController,
        //private nav: NavController,
        private viewCtrl: ViewController
    ) {
        //this.viewCtrl = viewCtrl;
        console.log(this.params.data);
        this.currentHouseList = this.params.data.list;
        this.imgHost = this.params.data.imgHost;


    }
    gotoHouseDetail(mls) {
        //close();
        this.nav.push(HouseDetailPage, { id: mls, list: this.currentHouseList });
    }


    close() {
        this.viewCtrl.dismiss();
    }


}