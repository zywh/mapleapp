import {Page, NavController} from 'ionic-angular';
//import {OnInit, NgZone} from 'angular2/core';
//import {mcHistChart} from './mcHistChart';
import {OnInit, Component} from '@angular/core';;
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';

declare var Highcharts: any;




/*
  Generated class for the StatsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    templateUrl: 'build/pages/stats/stats.html',
    //directives: [[mcHistChart], [mcStockChart]]

})


export class StatsPage {
    static get parameters() {
        return [[MapleRestData], [MapleConf]];
    }
    private section: string = "canada";
    private isAndroid: boolean = false;
    private options;
    private options1;
    private chart1;
    private chart2;
    private mlsdata;

    constructor(
        private mapleRestData: MapleRestData,
        private mapleconf: MapleConf
    ) {
        this.options = {
            title: { text: 'simple chart' },
            series: [{
                data: Array.from(new Array(100), (x, i) => i),
            }]
        };
        this.options1 = {
            title: { text: 'simple chart2' },
            series: [{
                data: Array.from(new Array(100), (x, i) => i),
            }]
        };

    }

    ngOnInit() {

        this.mapleconf.load().then(data => {
            console.log(data.getMlsDataRest);
            this.getResult(data.getMlsDataRest);
        })
    }
    
    getResult(url){
     this.mapleRestData.load(url, {id: 0}).subscribe(
      data => { this.mlsdata = data.mlsdata; console.log(this.mlsdata); }
    );
    }
    ngAfterViewInit() {

        // let viewHeight = window.innerHeight;
        // let viewWidth = window.innerWidth;
        // console.log("After ContentInit" + viewHeight + "Width:" + viewWidth);
        // Highcharts.setOptions({
        //     colors: ['#058DC7', '#50B432', '#ED561B']
        // });
        // this.chart = new Highcharts.chart('mc-hist-chart', this.chartOptions);
        this.chart1 = new Highcharts.chart('chart1', this.options);
        this.chart2 = new Highcharts.chart('chart2', this.options1);


    }
    onChange(e) {
        console.log(e.value);
        console.log(e);
    }


}
