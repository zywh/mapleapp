

import {Modal, Range, NavParams, Page, ViewController} from 'ionic-angular';
import {Component} from '@angular/core';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
import {UserData} from '../../providers/user-data';
import {AuthService} from '../../providers/auth/auth';

interface selectOptionsObj {
    selectType?: Boolean,
    selectRank?: Number,
    selectPingfen?: Number,
    selectXingzhi?: String
}

@Component({
    templateUrl: 'build/pages/school-map/schoolmap-option-modal.html'

})
export class SchoolSelectOptionModal {
    private selectOptions: selectOptionsObj;
  
    constructor(
       
       private params: NavParams,
        private auth: AuthService,
        private viewCtrl: ViewController,
        private mapleRestData: MapleRestData,
        private mapleConf: MapleConf,
        private userData: UserData
    ) {
       
        console.log(this.params);
        this.selectOptions = params.get('data');
      

    }

   
  
    resetSelections() {
        this.selectOptions = {
            selectPingfen: 0,
            selectRank: 0,
            selectType: false,
            selectXingzhi: ''

        }
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


}