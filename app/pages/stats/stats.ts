import {Page, NavController} from 'ionic-angular';
//import {OnInit, NgZone} from 'angular2/core';
//import {mcHistChart} from './mcHistChart';
import {OnInit, Component} from '@angular/core';;
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
import {SimpleChartExample} from './simpleChartExample';
import {McStockChart} from './mcStockChart';

//import { Component } from '@angular/core';
import { CHART_DIRECTIVES, Highcharts } from 'angular2-highcharts';

//declare var Highcharts: any;




/*
  Generated class for the StatsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    templateUrl: 'build/pages/stats/stats.html',
    directives: [[SimpleChartExample], [CHART_DIRECTIVES], [McStockChart]]

})


export class StatsPage {
    static get parameters() {
        return [[MapleRestData], [MapleConf]];
    }
    private section: string = "canada";
    private isAndroid: boolean = false;
    //private ctype = "Chart";
    private ctype = "StockChart";
    private options: HighstockOptions = {
        //renderTo: 'chartcontainer',
        
        credits: { enabled: false },
        chart: { zoomType: 'x' },
        rangeSelector: { selected: 5 },
        legend: { enabled: true },
        navigator: { enabled: false },
        scrollbar: { enabled: false },
        title: {
            text: '平均价格（万）'
        },
        series: [{
           name: 'init',
                 
        }]
       

    };
    private chart: HighchartsChartObject;
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

    private highchartsOptions = Highcharts.setOptions({
        lang: {
            loading: '加载中...',
            months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            shortMonths: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            exportButtonTitle: '导出',
            printButtonTitle: '打印',
            rangeSelectorFrom: '从',
            rangeSelectorTo: '到',
            rangeSelectorZoom: "缩放",
            downloadPNG: '下载PNG格式',
            downloadJPEG: '下载JPEG格式',
            downloadPDF: '下载PDF格式',
            downloadSVG: '下载SVG格式'
        }
    });

    constructor(
        private mapleRestData: MapleRestData,
        private mapleconf: MapleConf
    ) {
       
    }
    saveInstance(chartInstance) {
        this.chart = chartInstance;
    }

    // ngOnInit() {
    ionViewLoaded() {
        this.mapleconf.load().then(data => {
            console.log(data.getMlsDataRest);
            this.getResult(data.getMlsDataRest);
        })
    }

    getResult(url) {
        this.mapleRestData.load(url, { id: 0 }).subscribe(
            data => {

                let results = data.mlsdata;

                for (let type in results) {
                    let value = results[type]; // all,condo,detach

                    for (let f in value) {
                        let data = value[f];
                        let seriesname = type + "_" + f;  //all_avgprice
                        let chartdata = [];
                        let xdata = [];

                        //Loop through each day
                        for (let v in data) {
                            //var array = [ Number(this[0]) ,Number(this[1])];
                            chartdata.push([Number(data[v][0]), Number(data[v][1])]);
                            //xdata.push(data[v][0]);
                        }


                        this.seriesOptions[seriesname] = {
                            type: 'line',
                            name: this.cnnames[seriesname],
                            data: chartdata,
                            tooltip: {
                                valueDecimals: 0,
                                dateTimeLabelFormats: {
                                    minute: "%A, %b %e, %Y",
                                    hour: "%Y/%b",
                                    day: "%Y/%b",

                                }

                            }
                        };
                        //console.log(this.seriesOptions[seriesname]);
                    }

                }
                let viewHeight = window.innerHeight;
                let viewWidth = window.innerWidth;    

                console.log(viewHeight + ":" + viewWidth);

                this.chart.addSeries(this.seriesOptions["all_avgprice"]);
                this.chart.addSeries(this.seriesOptions["condo_avgprice"]);
                console.log(this.seriesOptions["condo_avgprice"]);
                this.chart.addSeries(this.seriesOptions["detach_avgprice"]);
                this.chart.series[0].remove();
                this.chart.setSize(viewWidth, viewHeight);
                this.chart.redraw();
               
                
            });
    }
    ngAfterViewInit() {


        //     // let viewHeight = window.innerHeight;
        //     // let viewWidth = window.innerWidth;
        //     // console.log("After ContentInit" + viewHeight + "Width:" + viewWidth);
        //     // Highcharts.setOptions({
        //     //     colors: ['#058DC7', '#50B432', '#ED561B']
        //     // });
        //     // this.chart = new Highcharts.chart('mc-hist-chart', this.chartOptions);
        //     this.chart1 = new Highcharts.chart('chart1', this.coption);
        //     console.log("Load chart before enter")

        //     //this.chart2 = new Highcharts.chart('chart2', this.options1);
        console.log("ngAfterViewInit")

    }
    ionViewWillEnter() {
        console.log("view loaded")

    }

    onChange(e) {
        console.log(e.value);
        console.log(e);
    }


}
