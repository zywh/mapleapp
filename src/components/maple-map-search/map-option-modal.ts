import { NavParams, ViewController, Events } from 'ionic-angular';
import { Component } from '@angular/core';
import { MapleRestData } from '../../providers/maple-rest-data/maple-rest-data';
import { MapleConf } from '../../providers/maple-rest-data/maple-config';
import { UserData } from '../../providers/user-data';
import { AuthService } from '../../providers/auth/auth';


@Component({
    templateUrl: 'map-option-modal.html'
})
export class SelectOptionModal {

    public selectOptions;
  

    public selectUnit: Boolean = true;
    public mapType;
    public inputText: string = '城市/地址/MLS#';
    public unit;
    public searchFlag: Boolean;

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
        //console.log(this.selectOptions);
        if (this.selectOptions.hasOwnProperty("selectSearch")) {
            this.inputText = this.selectOptions.selectSearch['id'];
            console.log("Select search existi");
            console.log(this.selectOptions.selectSearch);
        }

        this.searchFlag = params.get('searchflag');
        this.mapType = params.get('type');
        this.unit = 10;
        //this.getUserSelections();
        this.listenEvents();

    }


    ngOnInit() { //Need wait after constructor
        //this.inputText = this.selectOptions.selectSearch.id;

        // this.inputText = this.searchSelection['selectSearch']['id'];


    }


    onChange(ev) {
        this.unit = (this.selectUnit == true) ? 10 : 1;

    }

    searchSelection(e) {

        if (e != 'INFOCUS') {
            this.selectOptions['selectSearch'] = e;
            this.userData.saveCenter('recentCenter', e.id, e.lat, e.lng);
        } else {
            this.selectOptions['selectSearch'] = { id: '' };
        }



    }

    getMySelections() {
        let searchObject = this.selectOptions.selectSearch;
        this.userData.getUserSelections('houseSearch').then(res => {
            if (res != null) {
                this.selectOptions = res;
                this.selectOptions.selectSearch = searchObject;

            }
            // this.inputText = this.searchSelection['selectSearch']['id'];

        })
    }

    getMinMax(type: string, selection: string, sr: boolean) {
        let min: number, max: number, step: number, differ: number;
        let smin: number, smax: number;
        if (selection == "Price") {
            if (this.selectOptions.selectSR == false) {
                min = 0; max = 8000;
                smin = 0; smax = 8000;

            };
            if (this.selectOptions.selectSR == true) {
                min = 0; max = 600; step = 10;
                smin = 0; smax = 600;

            };
            differ = this.selectOptions.selectPrice.upper - this.selectOptions.selectPrice.lower;
            step = Math.floor((smax - smin) / 40);
        }

        if (differ < (smax - smin) * 0.2 && differ > (smax - smin) * 0.01) {

            let i = Math.floor(this.selectOptions.selectPrice.lower - differ * 1.2);
            let a = Math.ceil(this.selectOptions.selectPrice.upper + differ * 1.2);
            smin = (i > 0) ? i : min;
            smax = (a < max) ? a : max;
            console.log("Rescale- i:" + i + " smin:" + smin + "A:" + a + " smax:" + smax);
        }

        if (this.selectOptions.selectPrice.upper == smax) { smax = max };
        if (this.selectOptions.selectPrice.lower == smin) { smin = min };
        console.log("type:" + type + "min:" + min + "smin:" + smin + " max:" + max + " smax:" + smax + " step:" + step);
        if (type == 'min') return smin;
        if (type == 'max') return smax;
        if (type == 'step') return step;

    }



    resetSelections() {
        this.selectOptions = {
            selectSR: true,
            selectOH: false,
            selectBaths: 0,
            selectBeds: 0,
            selectHousesize: { lower: 0, upper: 4000 },
            selectLandsize: { lower: 0, upper: 43560 },
            selectPrice: { lower: 0, upper: 500 },
            selectType: [],
            selectListType: true,
            selectDate: 0,
            selectSearch: {}

        }


    }
    saveSelections() {
        let saveOption: Object = this.selectOptions;
        saveOption['selectSearch'] = {};
        let data = JSON.stringify(saveOption);
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