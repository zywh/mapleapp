
import {Input,Component} from '@angular/core';
//import { CHART_DIRECTIVES,Highcharts } from 'angular2-highcharts';
declare var Highcharts: any;


@Component({
    selector: 'mc-hist-chart',
    template: `
        <div id='mc-hist-chart'></div>
    `
})
export class mcHistChart {
    @Input() chartOptions;
    private chart;
    constructor() {
        this.options = {
            title: { text: 'simple chart' },
            series: [{
                data: Array.from(new Array(100), (x, i) => i),
            }]
        };
    }
    options: Object;

    ngAfterViewInit() {

        let viewHeight = window.innerHeight;
        let viewWidth = window.innerWidth;
        console.log("After ContentInit" + viewHeight + "Width:" + viewWidth);
        // Highcharts.setOptions({
        //     colors: ['#058DC7', '#50B432', '#ED561B']
        // });
        this.chart = new Highcharts.chart('mc-hist-chart', this.options);

    }
}