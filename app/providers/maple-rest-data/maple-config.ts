import {Injectable} from '@angular/core';
import { Http} from '@angular/http';
//import {Observable} from 'rxjs/Observable';
//import 'rxjs/Rx';


@Injectable()
export class MapleConf {
  data: any;
  public restHost: String = 'http://r.maplecity.com.cn/';
  private confJson = "mapleconf.json";

  // static get parameters() {
  //   return [[Http]]
  // }
  constructor(private http: Http) {

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


    return new Promise(resolve => {
      let center = { lat: 43.6532, lng: -79.3832 };
      let options = { timeout: 10000, enableHighAccuracy: true };
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let lat = position.coords.latitude;
          if (lat > 20) {
            center = { lat: lat, lng: position.coords.longitude };
            return resolve(center);
          } else {
            return resolve(center);
          }

        },
        (error) => { return resolve(center); }, options
      );

    });


  };

  
}

