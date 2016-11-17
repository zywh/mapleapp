export interface selectOptionInterface {

    selectSR: boolean,
    selectOH: boolean,
    selectBaths: number,
    selectBeds: number,
    selectHousesize: { lower: number, upper: number },
    selectLandsize: { lower: number, upper: number },
    selectPrice: { lower: number, upper: number },
    selectType: string,
    selectListType: boolean,
    selectDate: number,
    selectSearch: Object
}

export class selectOptionsModel {
    public selectOptions: selectOptionInterface;

    constructor() {
        this.resetOptions;
    }

    resetOptions() {
        this.selectOptions = {
            selectSR: true,
            selectOH: false,
            selectBaths: 0,
            selectBeds: 0,
            selectHousesize: { lower: 0, upper: 4000 },
            selectLandsize: { lower: 0, upper: 43560 },
            selectPrice: { lower: 0, upper: 600 },
            selectType: '',
            selectListType: true,
            selectDate: 0,
            selectSearch: {}
        }
    }
 set(d:selectOptionInterface){
     this.selectOptions = d;
 }

}