import {Modal, Range, NavParams, Page, ViewController, Events} from 'ionic-angular';
import {Component} from '@angular/core';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
import {UserData} from '../../providers/user-data';
import {AuthService} from '../../providers/auth/auth';

interface selectOptionsObj {
    selectPrice?: String,
    selectType?: Number,
    selectBeds?: Number,
    selectBaths?: Number,
    selectSR?: Boolean,
    selectHousesize?: String,
    selectLandsize?: String,
    selectListType?: Boolean,
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

        private params: NavParams,
        private auth: AuthService,
        private viewCtrl: ViewController,
        private mapleRestData: MapleRestData,
        private mapleConf: MapleConf,
        private userData: UserData,
        private events: Events
    ) {

        this.selectOptions = params.get('data');
        this.unit = 10;
        //this.getUserSelections();
        this.listenEvents();

    }


    onChange(ev) {
        this.unit = (this.selectUnit == true) ? 10 : 1;

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
            selectDate: 0

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