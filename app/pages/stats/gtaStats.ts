import {NavController, NavParams, ViewController} from 'ionic-angular';
import { Component }                    from '@angular/core';
//import { CHART_DIRECTIVES, Highcharts } from 'angular2-highcharts';
declare var Highcharts: any;

@Component({
    //selector: 'mc-stock-chart',
    //directives: [CHART_DIRECTIVES],
    template: `
    <ion-navbar *navbar>
    <button menuToggle>
    <ion-icon name="menu"></ion-icon>
    </button>
  <ion-title>统计</ion-title>
    </ion-navbar>
  
    <ion-content>
    <h2>Test Chart</h2>
    <div id="chartmls"></div>
    </ion-content>
    `


})
export class gtaStats {
    //private options: Object;
    private options: Object;
    private chart: HighchartsChartObject;
    constructor(private parm: NavParams, private view: ViewController) {
        this.options = this.parm.data;
        
    }

  
    ionViewLoaded() {
        console.log(this.options);
        this.chart = new Highcharts.StockChart(this.options);

    }

    dismiss() {
        this.view.dismiss();
    }





}
