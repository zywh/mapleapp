import {NavController, NavParams, ViewController} from 'ionic-angular';
import { Component }    from '@angular/core';
import {  Highcharts } from 'angular2-highcharts';
//declare var Highcharts: any;

@Component({
   
    template: `
    <ion-navbar *navbar>
    <button menuToggle>
    <ion-icon name="menu"></ion-icon>
    </button>
  <ion-title>统计</ion-title>
    </ion-navbar>
  
    <ion-content>
       <div id="chart"></div>
    </ion-content>
    `


})
export class chartStats {
    //private options: Object;
    private options: Object;
    private type: Number; // 0 for chart and 1 for highstock
    private pagetitle: String;
    private chart: HighchartsChartObject;
    constructor(private parm: NavParams, private view: ViewController) {
        this.type = this.parm.data.type;
        this.options = this.parm.data.options;
       
        // this.pagetitle = this.options["title"]["text"];
        // console.log(this.pagetitle);
        
    }

  
    ionViewLoaded() {
       if ( this.type == 0) {this.chart = new Highcharts.Chart(this.options);}
       if ( this.type == 1) {this.chart = new Highcharts.StockChart(this.options);}
    }

    dismiss() {
        this.view.dismiss();
    }





}
