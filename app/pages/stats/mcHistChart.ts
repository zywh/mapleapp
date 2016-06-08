
import {Input,Component} from '@angular/core';
//import {} from 'highcharts';
declare var Highcharts: any;


@Component({
    selector: 'mc-hist-chart',
    template: `
        <div ></div>
    `,
    //inputs: ['chartOptions','divId']
})
export class mcHistChart {
    @Input() chartOptions;
    @Input() id;
    private chart;
    constructor() {
       
    }
    options: Object;

    ngAfterViewInit() {

        // let viewHeight = window.innerHeight;
        // let viewWidth = window.innerWidth;
        // console.log("After ContentInit" + viewHeight + "Width:" + viewWidth);
        // Highcharts.setOptions({
        //     colors: ['#058DC7', '#50B432', '#ED561B']
        // });
       // this.chart = new Highcharts.chart('mc-hist-chart', this.chartOptions);
        this.chart = new Highcharts.chart(this.id, this.chartOptions);

    }
    updateChart(){
        
    }
}