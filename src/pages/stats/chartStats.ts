import {NavParams, ViewController,NavController} from 'ionic-angular';
import { Component }    from '@angular/core';
//import {  Highcharts } from 'angular2-highcharts';
declare var Highcharts: any;

@Component({

    template: `
    <ion-header>
        <ion-navbar >
        <ion-title>统计</ion-title>
        </ion-navbar>
    </ion-header>
 
  
    <ion-content >
     <ion-fab right bottom style="opacity:0.8;">
        <button ion-fab (click)="nav.pop()"><ion-icon name="undo"></ion-icon></button>
    </ion-fab>
    
       <div id="chart"></div>
      
    </ion-content>
    `


})
export class chartStats {
    //public options: Object;
    public options: Object;
    public type: number; // 0 for chart and 1 for highstock
    public pagetitle: string;
    public chart;
    constructor(private parm: NavParams, private view: ViewController,public nav:NavController) {
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
