import { bootstrap }                    from '@angular/platform-browser-dynamic';
import { Component }                    from '@angular/core';
import { CHART_DIRECTIVES, Highcharts } from 'angular2-highcharts'; 
import { Jsonp, JSONP_PROVIDERS }       from '@angular/http';
//import { CHART_DIRECTIVES }             from 'angular2-highcharts';

@Component({
    selector: 'mc-stock-chart',
    directives: [CHART_DIRECTIVES],
     template: `<chart type="StockChart" [options]="options"></chart>`,
     styles: [`chart { display: block; } `]
})
export class McStockChart {
    constructor(jsonp : Jsonp) {
        jsonp.request('https://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=JSONP_CALLBACK').subscribe(res => {
            this.options = {
                title : { text : 'AAPL Stock Price' },
                series : [{
                    name : 'AAPL',
                    data : res.json(),
                    tooltip: {
                        valueDecimals: 2
                    }
                }]
            };
        });
    }
    options: Object;
}
