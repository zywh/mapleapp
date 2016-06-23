import {Modal, Range, NavParams, Page, ViewController} from 'ionic-angular';
import {Component} from '@angular/core';;

interface selectOptionsObj {
    selectPrice?: String,
    selectType?: Number,
    selectBeds?: Number,
    selectBaths?: Number,
    selectSR?: Boolean,
    selectHousesize?: String,
    selectLandsize?: String,
    selectDate?: Number
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
            selectType: '',
            selectDate: 0

        }
    }


    dismiss() {
        this.viewCtrl.dismiss(this.selectOptions);
    }


}