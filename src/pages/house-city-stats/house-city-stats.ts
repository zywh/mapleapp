import {NavController, Modal,NavParams} from 'ionic-angular';
import {Component} from '@angular/core';;
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
//import {gtaStats} from './gtaStats';
import {CityStats} from './city-stats';
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

    //  series: eval("this.data." + topic + ".series"),
    //  drilldown: eval("this.data." + topic + ".drilldown"),
      drilldown: this.data[topic]['drilldown'],
        series: this.data[topic]['series'],

    };
    console.log(this.data[topic]);

    console.log(options)
    this.nav.push(CityStats, { city: this.city, options: options });
  }


}
