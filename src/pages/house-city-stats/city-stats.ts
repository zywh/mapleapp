import { NavParams, ViewController,NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { MapleConf } from '../../providers/maple-rest-data/maple-config';
import { UserData } from '../../providers/user-data';
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

       <ion-fab right bottom style="opacity:0.8;">
    <button ion-fab (click)="nav.pop()"><ion-icon name="undo"></ion-icon></button>
 </ion-fab>
       <div id="chart" [style.height]="chartHeight"></div>
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
    public chartHeight = "100%";
    //public chart: HighchartsChartObject;
    public chart;
    constructor(private parm: NavParams, public nav: NavController,private view: ViewController,private mapleConf: MapleConf,private userData: UserData) {
        this.city = this.parm.data.city;
        this.options = this.parm.data.options;
       // this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

    }


    ionViewWillEnter() {
       // this.tabBarElement.style.display = 'none';
        setTimeout(() => {
        this.chart = new Highcharts.Chart(this.options);

        }, 100); //add timeout to avoid chart size is over screen size initially
         if (this.mapleConf.helpFlag.stats == false ) {
            this.userData.presentToast("点击图表查看详情");
            this.mapleConf.helpFlag.stats = true;
        }

    }
    
    ionViewWillLeave() {
       // this.tabBarElement.style.display = 'flex';
    }



    dismiss() {
        this.view.dismiss();
    }





}