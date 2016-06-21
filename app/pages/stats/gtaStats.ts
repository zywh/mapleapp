import {NavController, NavParams,ViewController} from 'ionic-angular';
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

    <ion-toolbar>
        
        <ion-title>学校列表</ion-title>

        <ion-buttons end>
            <button (click)="dismiss()">关闭</button>
        </ion-buttons>
    </ion-toolbar>
    <ion-content>
    <h2>Test Chart</h2>
    <div id="chartmls"></div>
    </ion-content>
    `


})
export class gtaStats {
    options: Object;
   // options: HighstockChartObject;

    chart: HighchartsChartObject;
    constructor(private parm: NavParams,private view: ViewController) {
        this.options = this.parm.data;
        //console.log(this.options);
        //this.renderChart();
    }

    // saveInstance(chartInstance) {
    //     this.chart = chartInstance;
    // }
    ionViewLoaded() {
        console.log(this.options);
        // this.options = {
        //     chart: {
        //         renderTo: 'chartmls',
        //        // type: 'bar'
        //     },

        //     xAxis: {
        //         categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        //             'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        //     },

        //     series: [{
        //         data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        //     }]
        //     // other options
        // }
        // console.log(this.options);
        //this.chart = new Highcharts.Chart(this.options);
        
      this.chart = new Highcharts.StockChart(this.options);
      
    }

    dismiss() {
        this.view.dismiss();
    }





}
