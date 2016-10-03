import {Modal, Range, NavParams, ViewController, Events} from 'ionic-angular';
import {Component} from '@angular/core';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
import {UserData} from '../../providers/user-data';
import {AuthService} from '../../providers/auth/auth';
import {Search} from '../../components/search/search';

// interface selectOptionsObj {

//     selectPrice?: Object,
//     selectType?: String,
//     selectBeds?: Number,
//     selectBaths?: Number,
//     selectSR?: Boolean,
//     selectHousesize?: Object,
//     selectLandsize?: Object,
//     selectListType?: Boolean,
//     selectDate?: Number,
//     selectSearch?: Object
// }

@Component({
    templateUrl: 'map-option-modal.html'
})
export class SelectOptionModal {

    public selectOptions;
    //public selectOptions: selectOptionsObj;
    //  public selectOptions: {

    //     selectPrice?: Object,
    //     selectType?: String,
    //     selectBeds?: Number,
    //     selectBaths?: Number,
    //     selectSR?: Boolean,
    //     selectHousesize?: Object,
    //     selectLandsize?: Object,
    //     selectListType?: Boolean,
    //     selectDate?: Number,
    //     selectSearch?: Object
    // };
    // public selectOptions = {
    //     selectSR: true,
    //     selectBaths: 0,
    //     selectBeds: 0,
    //     selectHousesize: { lower: 0, upper: 4000 },
    //     selectLandsize: { lower: 0, upper: 43560 },
    //     selectPrice: { lower: 0, upper: 600 },
    //     selectType: '',
    //     selectListType: true,
    //     selectDate: 0,
    //     //selectSearch: ''

    // }

    public selectUnit: Boolean = true;
    public mapType;
    public unit;
    constructor(

        private params: NavParams,
        public auth: AuthService,
        private viewCtrl: ViewController,
        private mapleRestData: MapleRestData,
        private mapleConf: MapleConf,
        private userData: UserData,
        private events: Events
    ) {

        this.selectOptions = params.get('data');
        this.mapType = params.get('type');
        this.unit = 10;
        //this.getUserSelections();
        this.listenEvents();

    }


    onChange(ev) {
        this.unit = (this.selectUnit == true) ? 10 : 1;

    }

    searchSelection(e) {
        console.log(e);
        this.selectOptions['selectSearch'] = e;
    }

    getMySelections() {
        this.userData.getUserSelections('houseSearch').then(res => {
            if (res != null) {
               this.selectOptions = res;
            }

        })
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
            selectListType: true,
            selectDate: 0,
            selectSearch: ''

        }
    }
    saveSelections() {
        let data = JSON.stringify(this.selectOptions);
        console.log(data);
        this.userData.saveSelectOption(data, 'houseSearch').then(res => {
            console.log("save Selection Result:" + res);

        });


    }

    dismiss() {
        this.viewCtrl.dismiss(this.selectOptions);
    }

    listenEvents() {
        this.events.subscribe('profile:login', (data) => {

            this.dismiss(); //dismiss once login page is presented


        })
    }



}