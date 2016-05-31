
import {Component} from 'angular2/core';
//import {HTTP_PROVIDERS,Jsonp,ConnectionBackend} from 'angular2/http';
//import { CHART_DIRECTIVES,Highcharts } from 'angular2-highcharts';
declare var Highcharts: any;


@Component({
    selector: 'mc-stock-chart',
    //directives: [CHART_DIRECTIVES],
    
    template: ` <div id='mc-hist-chart'></div>`,
    //providers: [Jsonp,ConnectionBackend]
})
export class mcStockChart {
    private chart;
    private data;
    constructor(private jsonp: Jsonp) {
       
    }
    options: Object;

    ngAfterViewInit() {

        let viewHeight = window.innerHeight;
        let viewWidth = window.innerWidth;
        console.log("After ContentInit" + viewHeight + "Width:" + viewWidth);
        // Highcharts.setOptions({
        //     colors: ['#058DC7', '#50B432', '#ED561B']
        // });
        
         this.jsonp.request('https://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=JSONP_CALLBACK').subscribe(res => {
            // this.options = {
            //     title: { text: 'AAPL Stock Price' },
            //     series: [{
            //         name: 'AAPL',
            //         data: res.json(),
            //         tooltip: {
            //             valueDecimals: 2
            //         }
            //     }]
            // };
            this.data = res.json();
            this.chart = new Highcharts.StockChart({
                chart: {
                    renderTo: 'mc-stock-chart'
                },
                rangeSelector: {
                    selected: 1
                },
                series: [{
                    name: 'AAPL',
                    data: this.data,
                    tooltip: {
                        valueDecimals: 2
                    }
                }]
            });
        });
        
       

    }


}