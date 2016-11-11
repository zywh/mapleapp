

import { Modal, Range, NavParams, ViewController, Events } from 'ionic-angular';
import { Component } from '@angular/core';
import { MapleRestData } from '../../providers/maple-rest-data/maple-rest-data';
import { MapleConf } from '../../providers/maple-rest-data/maple-config';
import { UserData } from '../../providers/user-data';
import { AuthService } from '../../providers/auth/auth';
import { Search } from '../../components/search/search';

export interface selectOptionsObj {
    selectType?: boolean,
    selectRank?: number,
    selectPingfen?: number,
    selectXingzhi?: string,
    selectSearch?: Object
}

@Component({
    templateUrl: 'schoolmap-option-modal.html'
})
export class SchoolSelectOptionModal {
    public selectOptions: selectOptionsObj;

    constructor(

        private params: NavParams,
        public auth: AuthService,
        private viewCtrl: ViewController,
        private mapleRestData: MapleRestData,
        private mapleConf: MapleConf,
        private userData: UserData,
        private events: Events
    ) {

        console.log(this.params);
        this.selectOptions = params.get('data');


    }

    searchSelection(e) {
        console.log(e);
        this.selectOptions.selectSearch = e;
    }

    resetSelections() {
        this.selectOptions = {
            selectPingfen: 0,
            selectRank: 0,
            selectType: false,
            selectXingzhi: '',
            selectSearch: {}

        }
    }
    getMySelections() {
        let searchObject = this.selectOptions.selectSearch;
        this.userData.getUserSelections('schoolSearch').then(res => {
            if (res != null) {
                this.selectOptions = res;
                this.selectOptions.selectSearch = searchObject;

            }

        })
    }

    saveSelections() {
        let saveOption: Object = this.selectOptions;
        saveOption['selectSearch'] = {};
        let data = JSON.stringify(saveOption);
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