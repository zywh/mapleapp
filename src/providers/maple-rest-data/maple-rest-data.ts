import {Injectable} from '@angular/core';
//import {Http} from 'angular2/http';
import {Headers, RequestOptions} from '@angular/http';;
import {AuthHttp} from 'angular2-jwt';
//import 'rxjs/add/operator/map';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';


/*
  Generated class for the MapleRestData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MapleRestData {


  // static get parameters() {
  //   return [[Http],[MapleConf]]
  // }

  constructor(private authhttp: AuthHttp, private mapleconf: MapleConf) {

  }

  load(restURL, parms: Object) {

    let dataURL = this.mapleconf.restHost + restURL;
    let body = JSON.stringify({ parms });
    console.log("REST POST body:" + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let url = dataURL;

    return this.authhttp.post(url, body, options)
      .retryWhen(error => error.delay(500))
      .timeout(8000, new Error('delay exceeded')) // <------
      .map(res => res.json())
      //.catch(this.handleError);
  }

  // handleError(error: any) {
  //   console.error(error);
  //   return Observable.throw(error.json().error || 'Server error');
  // }
 
}

