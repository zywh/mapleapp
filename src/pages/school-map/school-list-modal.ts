import {ViewController, NavParams, Events} from 'ionic-angular';
import {Component} from '@angular/core';
declare var google: any;

@Component({
    templateUrl: 'school-list-modal.html'
})
export class SchoolListModal {
    public schoolList;

    constructor(
        private parm: NavParams,
        private events: Events,
        private viewCtrl: ViewController
    ) {
        this.schoolList = parm.get('data');
       
    }

    schoolClick(lat, lng) {
        let center = new google.maps.LatLng(lat, lng);
        this.events.publish('map:center', center); //public event and trigger tab select and map change
        this.dismiss();
    }


    dismiss() {
        this.viewCtrl.dismiss();
    }


}