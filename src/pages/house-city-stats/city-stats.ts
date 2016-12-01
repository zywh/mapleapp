import { NavParams, ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
//import {  Highcharts } from 'angular2-highcharts';
declare var Highcharts: any;

@Component({

    template: `
    <ion-header>
    <ion-navbar>
      <ion-title>{{city}}-统计</ion-title>
    </ion-navbar>
    </ion-header>
  
    <ion-content>
       <div id="chart"></div>
    </ion-content>
    `


})
export class CityStats {
    //public options: Object;
    public options: Object;
    public type: number; // 0 for chart and 1 for highstock
    public pagetitle: string;
    public city;
    private tabBarElement;
    //public chart: HighchartsChartObject;
    public chart;
    constructor(private parm: NavParams, private view: ViewController) {
        this.city = this.parm.data.city;
        this.options = this.parm.data.options;
        this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

    }


    ionViewWillEnter() {
        this.tabBarElement.style.display = 'none';
        setTimeout(() => {
        this.chart = new Highcharts.Chart(this.options);

        }, 100); //add timeout to avoid chart size is over screen size initially

    }
    
    ionViewWillLeave() {
        this.tabBarElement.style.display = 'flex';
    }



    dismiss() {
        this.view.dismiss();
    }





}