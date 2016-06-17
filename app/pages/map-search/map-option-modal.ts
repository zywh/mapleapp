import {Modal, Range, NavParams, Page, ViewController} from 'ionic-angular';
import {Component} from '@angular/core';;
//import {HouseDetailPage} from '../house-detail/house-detail';
//import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
//import {McSearchOption} from './search-option';

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
    private selectUnit: Boolean = true;
    private unit;
    constructor(
        //private platform: Platform,
        private params: NavParams,
        //private nav: NavController,
        private viewCtrl: ViewController
    ) {
        //this.viewCtrl = viewCtrl;
        console.log(this.params);
        this.selectOptions = params.get('data');
        this.unit = 10;

    }

    // brightness: number = 20;
    // saturation: number = 0;
    // warmth: number = 1300;

    // structure: any = { lower: 33, upper: 60 };
    onChange(ev) {
        console.log("Changed", ev);
        this.unit = (this.selectUnit == true)? 10: 1;

    }


    resetSelections() {
        this.selectOptions = {
            selectSR: true,
            selectBaths: 0,
            selectBeds: 0,
            selectHousesize: { lower: 0, upper: 4000 },
            selectLandsize: { lower: 0, upper: 43560 },
            selectPrice: { lower: 0, upper: 600 },
            selectType: ''

        }
    }


    dismiss() {
        this.viewCtrl.dismiss(this.selectOptions);
    }


}