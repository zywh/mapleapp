import {NavController, NavParams, ViewController} from 'ionic-angular';
import { Component }    from '@angular/core';
import {  Highcharts } from 'angular2-highcharts';
//declare var Highcharts: any;

@Component({

    template: `
    <ion-header>
        <ion-navbar >
        <ion-title>统计</ion-title>
        </ion-navbar>
    </ion-header>
 
  
    <ion-content >
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
      
    }


    ionViewWillEnter() {
       
        setTimeout(() => {
            console.log("Start Chart");
            if (this.type == 0) { this.chart = new Highcharts.Chart(this.options); }
            if (this.type == 1) { this.chart = new Highcharts.StockChart(this.options); }
        }, 100); //add timeout to avoid chart size is over screen size initially

    }

    dismiss() {
        this.view.dismiss();
    }





}
