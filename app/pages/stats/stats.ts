import {Page, NavController} from 'ionic-angular';
//import {OnInit, NgZone} from 'angular2/core';
import {mcHistChart} from './mcHistChart';
//import {mcStockChart} from './mcStockChart';
declare var Highcharts: any;


/*
  Generated class for the StatsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
    templateUrl: 'build/pages/stats/stats.html',
    directives: [mcHistChart]

})

export class StatsPage {
   
    constructor() {
      
    }
   

}
