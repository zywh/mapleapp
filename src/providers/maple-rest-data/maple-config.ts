import {Injectable} from '@angular/core';
import { Http} from '@angular/http';
import {Platform} from 'ionic-angular';
//import {Observable} from 'rxjs/Observable';
//import 'rxjs/Rx';


@Injectable()
export class MapleConf {
  data: any;
  location;
  public restHost: String = 'http://r.maplecity.com.cn/';
  //private confJson = "mapleconf.json"; //production
  private confJson = "mapleconf_dev.json"; //development
  private localVersion: String = '1.0.0';

  constructor(private http: Http, private platform: Platform) {

  }


  load() {

    let dataURL = this.restHost + this.confJson;
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
    return new Promise(resolve => {

      this.http.get(dataURL).subscribe(res => {

        this.data = res.json();
        resolve(this.data);
      });
    });
  }

  getLocation() {

   if (this.location) {
      // already loaded data
     // return Promise.resolve(this.location);
    }

  //Important: This is safe guard for map init. This introudce delay which is required for map switch. Otherwise it cause blank map when switching
 // below code need be commented out so if it's loaded and we still run geolocation code to introduce delay on purpose
    return new Promise(resolve => {
      let center = { lat: 43.6532, lng: -79.3832 };
      let options = { timeout: 10000, enableHighAccuracy: true };
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let lat = position.coords.latitude;
          if (lat > 20) {
            center = { lat: lat, lng: position.coords.longitude };
            this.location = center;
            return resolve(center);
          } else {
             this.location = center;
            return resolve(center);

          }

        },
        (error) => { 
          this.location = center;
          return resolve(center);  }, options
      );

    });


  };

  setHouseMarkerCss(countn, price) {
    let markercontent = '';

    let color = "hsl(" + this.getPrice2Scale(price) + ", 100%, 50%)";
    if (countn < 10) {
      // markercontent = "<i class='common_bg icon_map_mark16' style='background-color:" + color + ";'><span>" + countn + "</span></i>";
      markercontent = "<i class=' icon_map_mark1' style='background-color:" + color + ";'><span>" + countn + "</span></i>";
    }
    if ((countn >= 10) && (countn < 100)) {
      markercontent = "<i class=' icon_map_mark2' style='background-color:" + color + ";'><span>" + countn + "</span></i>";
    }
    if ((countn >= 100) && (countn < 1000)) {
      markercontent = "<i class=' icon_map_mark3' style='background-color:" + color + ";'><span>" + countn + "</span></i>";
    }
    if (countn >= 1000) {
      markercontent = "<i class='icon_map_mark4' style='background-color:" + color + ";'><span>" + countn + "</span></i>";
    }

    return markercontent;

  }

  setSchoolMarkerCss(rating) {
    var bg = this.getRating2Scale(rating).bg;
    var font = this.getRating2Scale(rating).font;
    var markercontent = "<i class='common_bg icon_map_mark2' style='background-color:" + bg + ";'><span style='color:" + font + ";'>" + rating + "</span></i>";
    return markercontent;

  }

  getRating2Scale(rating) {

    let color = {
      bg: '',
      font: ''
    };
    let hueEnd = 130;
    let ratingStep = hueEnd / 10; //Rating is 0-10
    let hue = Math.ceil(ratingStep * rating);
    color.bg = "hsl(" + hue + ", 100%, 50%)";
    color.font = "#000";
    if (rating == "无") {
      color.bg = "#757575";
      color.font = "#fff";
    };
    if (hue < 15) {
      color.font = "#fff";
    };

    return color;
  }

  getPrice2Scale(price) {

    //let wanPrice = Math.log2(price);
    let wanPrice = Math.ceil(price / 100000);
    let hue = 0;
    let hueStart = 0;
    let hueEnd = 70;

    //let maxPrice = Math.log2(500); // In 10,000
    let maxPrice = 50; // In 10,000
    let minPrice = 0;
    let PriceStep = (hueEnd - hueStart) / (maxPrice - minPrice);

    if (wanPrice >= maxPrice) {
      hue = 0;
    } else {
      hue = hueEnd - PriceStep * wanPrice;
    }
    //console.log("Price:" + price +" Hue:" + hue + "PriceStep:" + PriceStep);

    return Math.floor(hue);
  }
  mapDirection(lat, lng) {

    let destination = lat + ',' + lng;
    if (this.platform.is('ios')) {
      //window.open('maps://?q=' + destination, '_system');
       window.open('maps://?daddr=' + destination, '_system');

    } else {
      let label = encodeURI('目的地');
     // window.open('geo:0,0?q=' + destination + '(' + label + ')', '_system');
      //window.open('geo:0,0?daddr=' + destination + '(' + label + ')', '_system');
      window.open('google.navigation:q=' + destination + '&mode=d', '_system');
    }
  }

  nearBy(lat, lng,type) {

    let ll = lat + ',' + lng;
    if (this.platform.is('ios')) {
      //window.open('maps://?q=' + destination, '_system');
       window.open('maps://?ll=' + ll + '&q='+ type, '_system');

    } else {
     let label = encodeURI('目的地');
     // window.open('geo:0,0?q=' + destination + '(' + label + ')', '_system');
     window.open('geo:0,0?daddr=' + ll + '(' + label + ')', '_system');
    }
  }



  getPriceTxt(sr, price) {
    let priceTxt;
    if (sr == "Sale")
      priceTxt = Math.ceil(Number(price) / 10000) + "万";
    else {
      priceTxt = price + "/月";
    }

    return priceTxt;
  }

  getListDays(listDate) { // yyyy-mm-dd
    let date1:any = new Date(listDate);
    let date2:any = new Date();
    let diffdays = Math.floor((date2 - date1) / (1000*60*60*24));
 
    return diffdays + "天";
  }

}

