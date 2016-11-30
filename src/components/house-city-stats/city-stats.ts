import { NavParams, NavController, ViewController} from 'ionic-angular';
import { Component }    from '@angular/core';
//import {  Highcharts } from 'angular2-highcharts';
declare var Highcharts: any;

@Component({

    template: `
    
       <div id="chart"></div>
   
    `


})
export class CityStats {
    //public options: Object;
    public options: Object;
    public type: number; // 0 for chart and 1 for highstock
    public pagetitle: string;
    public city;
    //public chart: HighchartsChartObject;
    public chart;
    constructor(private parm: NavParams, private view: ViewController,public nav:NavController) {
        this.city = this.parm.data.city;
        this.options = this.parm.data.options;
      
    }


    ionViewWillEnter() {
        setTimeout(() => {
          
           this.chart = new Highcharts.Chart(this.options); 
          
        }, 100); //add timeout to avoid chart size is over screen size initially

    }

    dismiss() {
        this.view.dismiss();
    }





}
