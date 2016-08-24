import {Injectable} from '@angular/core';
//import {Http} from 'angular2/http';
import { Http, Headers, RequestOptions } from '@angular/http';;
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

  constructor(private http: Http, private authhttp: AuthHttp, private mapleconf: MapleConf) {

  }

  load(restURL, parms: Object) {

    let dataURL = this.mapleconf.restHost + restURL;
    let body = JSON.stringify({ parms });
    console.log("REST POST body:" + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let url = dataURL;

    return this.http.post(url, body, options)
      .retryWhen(error => error.delay(500))
      .timeout(5000, new Error('delay exceeded')) // <------
      .map(res => res.json())
      .catch(this.handleError);
  }

  authload(restURL, parms: Object) {

    let dataURL = this.mapleconf.restHost + restURL;
    let body = JSON.stringify({ parms });
    console.log("REST POST body:" + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let url = dataURL;

    return this.authhttp.post(url, body, options)
      .retryWhen(error => error.delay(500))
      .timeout(5000, new Error('delay exceeded')) // <------
      .map(res => res.json())
      .catch(this.handleError);
  }

  _load(restURL, parms: Object, isAuth: boolean = false) {

    let dataURL = this.mapleconf.restHost + restURL;
    let body = JSON.stringify({ parms });
    console.log("REST POST body:" + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let url = dataURL;
    let httpobj = (isAuth)? this.authhttp: this.http;
    console.log(url);
    console.log(httpobj);

    return httpobj.post(url, body, options)
      .retryWhen(error => error.delay(500))
      .timeout(5000, new Error('delay exceeded')) // <------
      .map(res => res.json())
      .catch(this.handleError);
  }

  handleError(error: any) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
 
    load1(restURL, parms: Object) {
      this._load(restURL, parms);
  }


    authload1(restURL, parms: Object) {
      this._load(restURL, parms, true);
  }

}

