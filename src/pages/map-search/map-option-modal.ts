import { NavParams, ViewController, Events } from 'ionic-angular';
import { Component} from '@angular/core';
import { MapleRestData } from '../../providers/maple-rest-data/maple-rest-data';
import { MapleConf } from '../../providers/maple-rest-data/maple-config';
import { UserData } from '../../providers/user-data';
import { AuthService } from '../../providers/auth/auth';
//import { Search } from '../../components/search/search';

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
    public inputText;
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
        console.log(e);
      
        if (e != 'INFOCUS') {
            this.selectOptions['selectSearch'] = e;
            this.userData.saveCenter('recentCenter', e.id, e.lat, e.lng);
        }else {
             this.selectOptions['selectSearch'] = {id: ''};
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



    resetSelections() {
        this.selectOptions = {
            selectSR: true,
            selectOH: false,
            selectBaths: 0,
            selectBeds: 0,
            selectHousesize: { lower: 0, upper: 4000 },
            selectLandsize: { lower: 0, upper: 43560 },
            selectPrice: { lower: 0, upper: 600 },
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