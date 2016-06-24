import {Page, NavController, Modal} from 'ionic-angular';
import {OnInit, Component} from '@angular/core';;
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
//import {gtaStats} from './gtaStats';
import {chartStats} from './chartStats';
import {Highcharts} from 'angular2-highcharts';

//declare var Highcharts: any;


@Component({
    templateUrl: 'build/pages/stats/stats.html',

})


export class StatsPage {

    private section: string = "canada";
    private isAndroid: boolean = false;
    private chart: HighchartsChartObject;
    private mlsdata;
    private hpiData;
    private seriesOptions = [];
    private city;
    private province;
    private property_type;
    private price;
    private housearea;
    private landarea;
    //private today;
    private locationName = {
        "Composite6": '全国综合指数6',
        "Composite11": '全国综合指数11',
        "Victoria": '维多利亚',
        "Vancouver": '温哥华',
        "Calgary": '卡尔加里',
        "Edmonton": '埃德蒙顿',
        "Hamilton": '哈密尔顿',
        "Toronto": '多伦多',
        "Ottawa": '渥太华',
        "Montreal": '蒙特利尔',
        "Quebec": '魁北克',
        "Halifax": '哈利法克斯',

    }
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
    private mlsChartList = [
        { data: 'price', tip: '价格', title: '价格分布图' },
        //{ data: 'property_type', tip: '房型', title: '房型分布饼图' },
        { data: 'housearea', tip: '房屋面积', title: '房屋面积分布图' },
        { data: 'landarea', tip: '土地面积', title: '土地面积分布图' },
        { data: 'city', tip: '城市房源', title: '城市房源分布图' },
        { data: 'province', tip: '省房源', title: '省房源分布图' }

    ];
    private gtaChartList = [
        { data: 'avgdom', title: '平均售出日' },
        { data: 'avgmoi', title: '存量月份' },
        { data: 'avgprice', title: '平均房价' },
        { data: 'avgsplp', title: '成交价/挂盘价比' },
        { data: 'active', title: '在售房源' },
        { data: 'sales', title: '月销售房源' },
        { data: 'newlist', title: '月新增房源' },
        { data: 'snlr', title: ' 售出/新盘比' },
    ]



    private hpiChartList = [
        { location: "Composite11", title: "全国综合指数11" },
        { location: "Toronto", title: "多伦多房屋指数图表" },
        { location: "Vancouver", title: "温哥华房屋指数图表" },
        { location: "Calgary", title: "卡尔加里房屋指数图表" },
        { location: "Victoria", title: "维多利亚房屋指数图表" },
        { location: "Edmonton", title: "埃德蒙顿房屋指数图表" },
        { location: "Ottawa", title: "渥太华房屋指数图表" },
        { location: "Montreal", title: "蒙特利尔房屋指数图表" },
        { location: "Quebec", title: "魁北克房屋指数图表" },
        { location: "Halifax", title: "哈利法克斯房屋指数图表" },
        { location: "Hamilton", title: "哈密尔顿房屋指数图表" },
    ]

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
        private mapleconf: MapleConf,
        private nav: NavController
    ) { }

    saveInstance(chartInstance) {
        this.chart = chartInstance;
    }
    date2str() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        return yyyy + "-" + mm + "-" + dd;
    }

    // ngOnInit() {
    ionViewLoaded() {
        this.mapleconf.load().then(data => {
            //console.log(data.getMlsDataRest);
            this.getMlsResult(data.getMlsDataRest);
            this.getHouseStats(data.getHouseStatsRest);
            this.getHpiStats(data.hpiStatsRest);
        })
    }

    getMlsResult(url) {
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


            });
    }


    getHpiStats(url) {
        this.mapleRestData.load(url, { id: 0 }).subscribe(
            data => {

                for (let location in data) {
                    let value = data[location]; // Hamilton,Vancouver etc
                    console.log(location);
                    let chartdata = [];
                    //Loop through each month
                    //console.log(value);
                    for (let v in value) {
                        chartdata.push([Number(value[v]["date"]), Number(value[v]["hpi"])]);
                    }


                    this.seriesOptions[location] = {
                        type: 'line',
                        name: this.locationName[location],
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
                    console.log(this.seriesOptions[location]);
                }


            });
    }

    getHouseStats(url) {
        this.mapleRestData.load(url, { id: 0 }).subscribe(
            data => {
                this.city = data.city;
                this.province = data.province;
                this.property_type = data.property_type;
                this.price = data.price;
                this.housearea = data.housearea;
                this.landarea = data.landarea;
                //console.log(landarea);


            });

    }

    hpiStats(location, t) {

        let options: HighstockOptions = {
            credits: { enabled: false },
            chart: {
                zoomType: 'x',
                renderTo: 'chart'
            },
            rangeSelector: { inputEnabled: false },
            legend: { enabled: true },
            navigator: { enabled: false },
            scrollbar: { enabled: false },
            title: { text: t },
            series: [
                this.seriesOptions[location],

            ]

        };

        this.nav.push(chartStats, { type: 1, options: options });


    }

    gtaStats(c, t) {

        let options: HighstockOptions = {
            credits: { enabled: false },
            chart: {
                zoomType: 'x',
                renderTo: 'chart'
            },
            rangeSelector: { inputEnabled: false },
            legend: { enabled: true },
            navigator: { enabled: true },
            scrollbar: { enabled: true },
            title: { text: t },
            //series: [{}]
            series: [
                this.seriesOptions["all_" + c],
                this.seriesOptions["detach_" + c],
                this.seriesOptions["condo_" + c]
            ]

        };
        console.log(c);
        console.log(options);    
        this.nav.push(chartStats, { type: 1, options: options });


    }

    houseStatsPie(name, tname, title) {
        let options: HighchartsOptions = {
            credits: { enabled: false },
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                renderTo: 'chart',
                type: 'pie'
            },

            title: { text: title },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                name: tname,
                data: eval("this." + name)
            }]



        };
        this.nav.push(chartStats, { type: 0, options: options });
    }

    houseStatsColumn(name, tname, title) {
        let options: HighchartsOptions = {
            credits: { enabled: false },
            chart: {
                renderTo: 'chart',
                type: 'column'
            },

            title: { text: title },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    text: '房源数量（套）'
                }

            },
            legend: {
                enabled: false
            },
            // plotOptions: {
            //     series: {
            //         //borderWidth: 0,
            //         dataLabels: {
            //             enabled: true,
            //             format: '{point.y:.1f}%'
            //         }
            //     }
            // },

            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}套<br/>'
            },


            series: [{
                name: tname,
                data: eval("this." + name)
            }]



        };
        this.nav.push(chartStats, { type: 0, options: options });
    }


}
