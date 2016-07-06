import {ViewController, NavParams, Events} from 'ionic-angular';
import {Geolocation} from 'ionic-native';

import {Component} from '@angular/core';;


@Component({
    templateUrl: 'build/pages/school-map/school-list-modal.html'

})
export class SchoolListModal {
    private schoolList;

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