import {Modal, Loading, Alert, ActionSheet, MenuController, Platform, NavController, NavParams, Page, ViewController} from 'ionic-angular';
//import {ionicBootstrap} from 'ionic-angular'
import {Geolocation} from 'ionic-native';
//import {AngularRange} from 'angular-ranger';
//import {RichMarker} from 'rich-marker'; It doesn't provide TS definition. Use ext URL to include in index.html
import {OnInit, NgZone,Component} from '@angular/core';;
import {HouseDetailPage} from '../house-detail/house-detail';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {McSearchOption} from './search-option';
declare var RichMarker: any;
interface selectOptionsObj {
    selectPrice?: String,
    selectType?: Number,
    selectBeds?: Number,
    selectBaths?: Number,
    selectSR?: Boolean,
    selectHousesize?: String,
    selectLandsize?: String
}

@Component({
    templateUrl: 'build/pages/map-search/map-option-modal.html'

})
export class SelectOptionModal {
    selectOptions: Object;
    constructor(
        private platform: Platform,
        private params: NavParams,
        private nav: NavController,
        private viewCtrl: ViewController
    ) {
        //this.viewCtrl = viewCtrl;
        console.log(this.params);
        this.selectOptions = params.get('data');

    }

    resetSelections() {
        // this.selectPrice = '';
        // this.selectType = '';
        // this.selectBeds = 0;
        // this.selectBaths = 0;
        // this.selectSR = true;
        // this.selectHousesize = '';
        // this.selectLandsize = '';
        this.selectOptions = {
            selectSR: true,
            selectBaths: 0,
            selectBeds: 0,
            selectHousesize: '',
            selectLandsize: '',
            selectPrice: '',
            selectType: ''

        }
    }
    
 
    dismiss() {
        this.viewCtrl.dismiss(this.selectOptions);
    }
    
    
}