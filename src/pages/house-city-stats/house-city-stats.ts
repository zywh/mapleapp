import {NavController, Modal,NavParams} from 'ionic-angular';
import {Component} from '@angular/core';;
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
//import {gtaStats} from './gtaStats';
import {cityStats} from './cityStats';
//import {Highcharts} from 'angular2-highcharts';
declare var Highcharts: any;

@Component({
  templateUrl: 'house-city-stats.html',
})
export class HouseCityStatsPage {

  //public chart: HighchartsChartObject;
  public chart;
  public seriesOptions = [];
  public topics = [];
  public data;
  public city: String;
  

  constructor(
    private mapleRestData: MapleRestData,
    private parm: NavParams,
    private mapleconf: MapleConf,
    private nav: NavController
  ) { 
    this.city = parm.data;
  }

  date2str() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  }

  ionViewWillEnter() {

    console.log("Stats Page will enter");
    if (this.topics.length == 0) {
      this.mapleconf.load().then(data => {
        //console.log(data.getMlsDataRest);
        this.getCityStats(data.getCityDataRest);

      })
    }  
      
  }

  getCityStats(url) {
    this.mapleRestData.load(url, { city: this.city }).subscribe(
      data => {
        this.topics = [];
        this.data = data;
        console.log(data);
        for (let topic in data) {
          //console.log(topic);
          this.topics.push(topic);

        }


      });
  }

  wordbreaks(str) {
      let words = str.split(/\s+/);
      for (var i = 4; i > 0; i--)
        if (words.length >= 7*i) words.splice(7*i, 0, '<br>');
      console.log(words);

      return words.join(' ');    
  }

  cityStatsColumn(topic) {
    console.log("Display City Chart:" + topic);
    let options = {
      credits: { enabled: false },
      chart: {
        renderTo: 'chart',
        //height: 600,
        // type: 'column'
        type: 'pie'
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

      title: { text: topic },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: '数量'
        }
      },
      legend: {
        enabled: true,
        // layout: 'vertical',
        // align: 'right',
        // verticalAlign: 'top',
        // x: -40,
        // y: 80,
        labelFormatter: function () {
          let words = this.name.split(/\s+/);
          for (var i = 4; i > 0; i--)
            if (words.length >= 7*i) words.splice(7*i, 0, '<br>');
          //console.log(words);
          return words.join(' ');
        }

      },
  
      tooltip: {
        //headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        headerFormat: '',
        pointFormatter: function () {
          let words = this.name.split(/\s+/);
          for (var i = 4; i > 0; i--)
            if (words.length >= 7*i) words.splice(7*i, 0, '<br>');
          //console.log(words);
          return "<span style='color:black'>" + words.join(' ') + "</span>: <br><b>" + this.y + "</b>";
        }
        //pointFormat: '<span style="color:black">{point.name}</span>: <br><b>{point.y}</b>'
        //pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}<br/>'
      },

     series: eval("this.data." + topic + ".series"),
     drilldown: eval("this.data." + topic + ".drilldown"),
      // drilldown: this.data[topic]['drilldown'],
      //   series: this.data[topic]['series'],

    };
    console.log(this.data[topic]);
    
//    let  options = { 
//     chart: {
//         renderTo: 'chart',
//             type: 'column'
//         },
//         title: {
//             text: 'Browser market shares. January, 2015 to May, 2015'
//         },
//         subtitle: {
//             text: 'Click the columns to view versions. Source: <a href="http://netmarketshare.com">netmarketshare.com</a>.'
//         },
//         xAxis: {
//             type: 'category'
//         },
//         yAxis: {
//             title: {
//                 text: 'Total percent market share'
//             }

//         },
//         legend: {
//             enabled: false
//         },
//         plotOptions: {
//             series: {
//                 borderWidth: 0,
//                 dataLabels: {
//                     enabled: true,
//                     format: '{point.y:.1f}%'
//                 }
//             }
//         },

//         tooltip: {
//             headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
//             pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
//         },

//         series: [{
//             name: 'Brands',
//             colorByPoint: true,
//             data: [{
//                 name: 'Microsoft Internet Explorer',
//                 y: 56.33,
//                 drilldown: 'Microsoft Internet Explorer'
//             }, {
//                 name: 'Chrome',
//                 y: 24.03,
//                 drilldown: 'Chrome'
//             }, {
//                 name: 'Firefox',
//                 y: 10.38,
//                 drilldown: 'Firefox'
//             }, {
//                 name: 'Safari',
//                 y: 4.77,
//                 drilldown: 'Safari'
//             }, {
//                 name: 'Opera',
//                 y: 0.91,
//                 drilldown: 'Opera'
//             }, {
//                 name: 'Proprietary or Undetectable',
//                 y: 0.2,
//                 drilldown: null
//             }]
//         }],
//         drilldown: {
//             series: [{
//                 name: 'Microsoft Internet Explorer',
//                 id: 'Microsoft Internet Explorer',
//                 data: [
//                     [
//                         'v11.0',
//                         24.13
//                     ],
//                     [
//                         'v8.0',
//                         17.2
//                     ],
//                     [
//                         'v9.0',
//                         8.11
//                     ],
//                     [
//                         'v10.0',
//                         5.33
//                     ],
//                     [
//                         'v6.0',
//                         1.06
//                     ],
//                     [
//                         'v7.0',
//                         0.5
//                     ]
//                 ]
//             }, {
//                 name: 'Chrome',
//                 id: 'Chrome',
//                 data: [
//                     [
//                         'v40.0',
//                         5
//                     ],
//                     [
//                         'v41.0',
//                         4.32
//                     ],
//                     [
//                         'v42.0',
//                         3.68
//                     ],
//                     [
//                         'v39.0',
//                         2.96
//                     ],
//                     [
//                         'v36.0',
//                         2.53
//                     ],
//                     [
//                         'v43.0',
//                         1.45
//                     ],
//                     [
//                         'v31.0',
//                         1.24
//                     ],
//                     [
//                         'v35.0',
//                         0.85
//                     ],
//                     [
//                         'v38.0',
//                         0.6
//                     ],
//                     [
//                         'v32.0',
//                         0.55
//                     ],
//                     [
//                         'v37.0',
//                         0.38
//                     ],
//                     [
//                         'v33.0',
//                         0.19
//                     ],
//                     [
//                         'v34.0',
//                         0.14
//                     ],
//                     [
//                         'v30.0',
//                         0.14
//                     ]
//                 ]
//             }, {
//                 name: 'Firefox',
//                 id: 'Firefox',
//                 data: [
//                     [
//                         'v35',
//                         2.76
//                     ],
//                     [
//                         'v36',
//                         2.32
//                     ],
//                     [
//                         'v37',
//                         2.31
//                     ],
//                     [
//                         'v34',
//                         1.27
//                     ],
//                     [
//                         'v38',
//                         1.02
//                     ],
//                     [
//                         'v31',
//                         0.33
//                     ],
//                     [
//                         'v33',
//                         0.22
//                     ],
//                     [
//                         'v32',
//                         0.15
//                     ]
//                 ]
//             }, {
//                 name: 'Safari',
//                 id: 'Safari',
//                 data: [
//                     [
//                         'v8.0',
//                         2.56
//                     ],
//                     [
//                         'v7.1',
//                         0.77
//                     ],
//                     [
//                         'v5.1',
//                         0.42
//                     ],
//                     [
//                         'v5.0',
//                         0.3
//                     ],
//                     [
//                         'v6.1',
//                         0.29
//                     ],
//                     [
//                         'v7.0',
//                         0.26
//                     ],
//                     [
//                         'v6.2',
//                         0.17
//                     ]
//                 ]
//             }, {
//                 name: 'Opera',
//                 id: 'Opera',
//                 data: [
//                     [
//                         'v12.x',
//                         0.34
//                     ],
//                     [
//                         'v28',
//                         0.24
//                     ],
//                     [
//                         'v27',
//                         0.17
//                     ],
//                     [
//                         'v29',
//                         0.16
//                     ]
//                 ]
//             }]
//         }
//     };

    console.log(options)
    this.nav.push(cityStats, { city: this.city, options: options });
  }


}
