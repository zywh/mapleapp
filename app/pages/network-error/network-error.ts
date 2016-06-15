import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {TabsPage} from '../tabs/tabs';
import {Connectivity} from '../../providers/connectivity/connectivity';

/*
  Generated class for the NetworkErrorPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/network-error/network-error.html',
})
export class NetworkErrorPage {
  constructor(public nav: NavController,private connectivity: Connectivity) {
    this.addConnectivityListeners();
  }

 refresh() {
    //this.addConnectivityListeners();
    console.log("Google maps JavaScript needs to be loaded.");
    if (this.connectivity.isOnline()) {
      console.log("online, loading map");
      let script = document.createElement("script");
      script.id = "googleMaps";
      script.src = "http://ditu.google.cn/maps/api/js?&amp;libraries=places&amp;language=zh-cn";
      document.body.appendChild(script);
      this.nav.setRoot(TabsPage);
      
    } else {
      console.log("Network Offline: load error page")
      
    }
  }
 
  addConnectivityListeners() {


    let onOnline = function () {
      setTimeout(function () {
        if (typeof google == "undefined" || typeof google.maps == "undefined") {
          let script = document.createElement("script");
          //script.id = "googleMaps";
          script.src = "http://ditu.google.cn/maps/api/js?&amp;libraries=places&amp;language=zh-cn";
          document.body.appendChild(script);

        } else {
          //this.nav.setRoot(TabsPage);
        }
      }, 2000);
    };

    let onOffline = function () {
       this.nav.setRoot(NetworkErrorPage);
    };

    document.addEventListener('online', onOnline, false);
    document.addEventListener('offline', onOffline, false);

  }
}
