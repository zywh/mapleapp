import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import 'rxjs/add/operator/map';
import {MAPLECONF} from '../../providers/maple-rest-data/maple-config';

//let mapleRestHost = "http://m.maplecity.com.cn/";
/*
  Generated class for the MapleRestData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MapleRestData {
  private http: Http;
  private data: any;
 
  static get parameters() {
    return [[Http]]
  }

  constructor(http) {
    this.http = http;
     }

  load(restURL, parms: Object) {
   
    let dataURL = 'http://m.maplecity.com.cn/' + restURL;
    //let body = "parms";

    let str = [];
    for (var p in parms) {
      if (parms.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(parms[p]));
      }
    }
    let body = str.join("&");


    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      this.http.post(dataURL, body)
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.data = data;
          resolve(this.data);
        });
    });
  }
}

