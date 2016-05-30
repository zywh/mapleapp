
import {Component} from 'angular2/core';
import { CHART_DIRECTIVES,Highcharts } from 'angular2-highcharts';



Highcharts.setOptions({
    colors: ['#058DC7', '#50B432', '#ED561B']
});

@Component({
    selector: 'hc',
    directives: [CHART_DIRECTIVES],
    template: `
        <chart [options]="options"></chart>
    `
})
export class SimpleChartExample {
    constructor() {
        this.options = {
            title : { text : 'simple chart' },
            series: [{
                data: Array.from(new Array(100), (x,i) => i),
            }]
        };
    }
    options: Object;
}