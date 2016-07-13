import {NavController, Modal,NavParams} from 'ionic-angular';
import {Component} from '@angular/core';;
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
//import {gtaStats} from './gtaStats';
import {cityStats} from './cityStats';
import {Highcharts} from 'angular2-highcharts';

@Component({
  templateUrl: 'build/pages/house-city-stats/house-city-stats.html',
})
export class HouseCityStatsPage {

  private chart: HighchartsChartObject;
  private seriesOptions = [];
  private topics = [];
  private data;
  private city: String;
  

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



  cityStatsColumn(topic) {
    console.log("Display City Chart:" + topic);
    let options: HighchartsOptions = {
      credits: { enabled: false },
      chart: {
        renderTo: 'chart',
        // type: 'column'
        type: 'bar'
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
        enabled: false,
        // layout: 'vertical',
        // align: 'right',
        // verticalAlign: 'top',
        // x: -40,
        // y: 80,

      },
  
      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}<br/>'
      },


      series: [{
        name: topic,
        data: eval("this.data." + topic)
      }]



    };
    //console.log(this.data[topic]);
    this.nav.push(cityStats, { city: this.city, options: options });
  }


}
