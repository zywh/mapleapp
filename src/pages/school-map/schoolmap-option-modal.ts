

import {Modal, Range, NavParams, ViewController, Events} from 'ionic-angular';
import {Component} from '@angular/core';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
import {UserData} from '../../providers/user-data';
import {AuthService} from '../../providers/auth/auth';
import {Search} from '../../components/search/search';

export interface selectOptionsObj {
    selectType?: Boolean,
    selectRank?: Number,
    selectPingfen?: Number,
    selectXingzhi?: String
}

@Component({
    templateUrl: 'schoolmap-option-modal.html'
})
export class SchoolSelectOptionModal {
    public selectOptions: selectOptionsObj;

    constructor(

        private params: NavParams,
        private auth: AuthService,
        private viewCtrl: ViewController,
        private mapleRestData: MapleRestData,
        private mapleConf: MapleConf,
        private userData: UserData,
        private events: Events
    ) {

        console.log(this.params);
        this.selectOptions = params.get('data');


    }

    searchSelection(e){
        console.log(e);
        this.selectOptions['selectSearch'] = e;
    }

    resetSelections() {
        this.selectOptions = {
            selectPingfen: 0,
            selectRank: 0,
            selectType: false,
            selectXingzhi: ''

        }
    }
    getMySelections() {
        this.userData.getUserSelections('schoolSearch').then(res => {
            if (res != null) {
                this.selectOptions = res;
            }

        })
    }

    saveSelections() {
        let data = JSON.stringify(this.selectOptions);
        console.log(data);
        this.userData.saveSelectOption(data, 'schoolSearch').then(res => {
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