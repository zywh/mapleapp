import {Modal, Range, Loading, Alert, ActionSheet, MenuController, Platform, NavController, NavParams, Page, ViewController} from 'ionic-angular';
import {Geolocation} from 'ionic-native';

import {OnInit, NgZone, Component} from '@angular/core';;
import {HouseDetailPage} from '../house-detail/house-detail';
//import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
//import {McSearchOption} from './search-option';
declare var RichMarker: any;
interface schoolSelectOptionsObj {
    selectType?: Boolean,
    selectRank?: Number,
    selectPingfen?: Number,
    selectXingzhi?: String
}

@Component({
    templateUrl: 'build/pages/school-map/schoolmap-option-modal.html'

})
export class SelectOptionModal {
    private selectOptions: schoolSelectOptionsObj;
  
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
        this.selectOptions = {
            selectPingfen: 0,
            selectRank: 0,
            selectType: true,
            selectXingzhi: ''

        }
    }


    dismiss() {
        this.viewCtrl.dismiss(this.selectOptions);
    }


}