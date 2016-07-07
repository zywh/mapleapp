import {NavController, Modal,NavParams} from 'ionic-angular';
import {Component} from '@angular/core';;
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
//import {gtaStats} from './gtaStats';
import {cityStats} from './cityStats';
import {Highcharts} from 'angular2-highcharts';


/*
  Generated class for the HouseCityStatsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/house-city-stats/house-city-stats.html',
})
export class HouseCityStatsPage {

  private chart: HighchartsChartObject;
  private seriesOptions = [];
  private topics = [];
  private data;
  private city: String;
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

  // ngOnInit() {
  ionViewLoaded() {

  }

  ionViewWillEnter() {
    console.log("Stats Page will enter");
    this.mapleconf.load().then(data => {
      //console.log(data.getMlsDataRest);
      this.getCityStats(data.getCityDataRest);

    })
  }

  getCityStats(url) {
    this.mapleRestData.load(url, { city: this.city }).subscribe(
      data => {
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
