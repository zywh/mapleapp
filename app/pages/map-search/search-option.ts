import {IONIC_DIRECTIVES} from 'ionic-angular';
//import {Component} from 'angular2/core';
import {Component, Input, Output, EventEmitter} from 'angular2/core';

@Component({
    selector: 'mc-search-option',
    directives: [IONIC_DIRECTIVES],
    templateUrl: 'build/pages/map-search/search-option.html',
})
export class McSearchOption {
    @Input() selectOptions: Object;
    @Output() optionChange = new EventEmitter();
    // private selectPrice;
    // private selectType;
    // private selectBeds: Number = 0;
    // private selectBaths: Number = 0;
    // private selectSR: Boolean = true;
    // private selectHousesize;
    // private selectLandsize;
    //private selectOptions: Object;
    constructor() { }

    resetSelections() {
        // this.selectPrice = '';
        // this.selectType = '';
        // this.selectBeds = 0;
        // this.selectBaths = 0;
        // this.selectSR = true;
        // this.selectHousesize = '';
        // this.selectLandsize = '';
        this.selectOptions = {
            selectSR: true,
            selectBaths: 0,
            selectBeds: 0,
            selectHousesize: '',
            selectLandsize: '',
            selectPrice: '',
            selectType: ''

        }

    }
    updateOption() {
        this.optionChange.emit(
            // {
            // selectPrice: this.selectPrice,
            // selectType: this.selectType,
            // selectBeds: this.selectBeds,
            // selectBaths: this.selectBaths,
            // selectSR: this.selectSR,
            // selectHousesize: this.selectHousesize,
            // selectLandsize: this.selectLandsize
            // }
            this.selectOptions
        )
    }

}
