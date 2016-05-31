
import {Component} from '@angular/core';
import { CHART_DIRECTIVES,Highcharts } from 'angular2-highcharts';



@Component({
    selector: 'dynamic-chart-example',
    directives: [CHART_DIRECTIVES],
    template: `
        <chart [options]="options" (load)="saveInstance($event.context)"></chart>
        <button (click)="addPoint()">Add Point</button>
    `
})

export class DynamicChartExample {
    constructor() {
        this.options = {
            title: { text : 'chart with dynamic data' },
            series: [{
                data: [2,3,5,8]
            }]
        }
    }
    chart : HighchartsChartObject;
    options: HighchartsOptions;
    saveInstance(chartInstance) {
        this.chart = chartInstance;
    }
    addPoint() {
        this.chart.series[0].addPoint(Math.random() * 10);
    }
}