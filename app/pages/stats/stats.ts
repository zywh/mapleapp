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
    private seriesOptions = [];
    private cnnames = {
        'all_avgprice': '所有房源：平均房价',
        'condo_avgprice': '楼房：平均房价',
        'detach_avgprice': '独立房：平均房价',
        'all_moi': '所有房源：存量月份',
        'condo_moi': '楼房：存量月份',
        'detach_moi': '独立房：存量月份',
        'all_avgsplp': '所有房源：成交价/挂盘价比',
        'condo_avgsplp': '楼房：成交价/挂盘价比',
        'detach_avgsplp': '独立房：成交价/挂盘价比',
        'all_avgdom': '所有房源：平均售出日',
        'condo_avgdom': '楼房：平均售出日',
        'detach_avgdom': '独立房：平均售出日',
        'all_active': '所有房源：在售房源',
        'condo_active': '楼房：在售房源',
        'detach_active': '独立房：在售房源',
        'all_sales': '所有房源：月销售房源',
        'condo_sales': '楼房：月销售房源',
        'detach_sales': '独立房：月销售房源',
        'all_newlist': '所有房源：月新增房源',
        'condo_newlist': '楼房：月新增房源',
        'detach_newlist': '独立房：月新增房源',
        'all_snlr': '所有房源：售出/新盘比',
        'condo_snlr': '楼房：售出/新盘比',
        'detach_snlr': '独立房：售出/新盘比'

    };

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

    getResult(url) {
        this.mapleRestData.load(url, { id: 0 }).subscribe(
            data => {
                // this.mlsdata = data.mlsdata;
                let results = data.mlsdata;
                console.log(results);
                for (let type in results) {
                    let value = results[type];
                    for (let f in value) {
                        let data = value[f];
                        console.log("KEY" + f);
                        console.log("Value:" + results[type])
                        var seriesname = + "_" + f;  //all_avgprice
                        var chartdata = [];
                        let xdata = [];

                        //Loop through each day
                        $(data).each(function (index) {
                            //var array = [ Number(this[0]) ,Number(this[1])];
                            chartdata.push(Number(this[1]));
                            xdata.push(this[0]);
                        });


                        this.seriesOptions[seriesname] = {
                            type: 'line',
                            name: cnnames[seriesname],
                            data: chartdata

                        }
                    }

                }
            }
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
