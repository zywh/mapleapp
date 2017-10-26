

import { NavParams, ViewController, Events } from 'ionic-angular';
import { Component } from '@angular/core';
import { MapleRestData } from '../../providers/maple-rest-data/maple-rest-data';
import { MapleConf } from '../../providers/maple-rest-data/maple-config';
import { UserData } from '../../providers/user-data';
import { AuthService } from '../../services/auth.service';


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
    public inputText: string = "城市/学校";

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
         if (this.selectOptions.hasOwnProperty("selectSearch")) {
            this.inputText = this.selectOptions.selectSearch['id'];
          
        }


    }

    searchSelection(e) {
     
        this.selectOptions.selectSearch = e;
        this.inputText = e.id;
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