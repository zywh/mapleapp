import {Component} from '@angular/core';
import {NavController,AlertController} from 'ionic-angular';
import {TabsPage} from '../tabs/tabs';
import {Connectivity} from '../../providers/connectivity';
declare var google: any;

/*
  Generated class for the NetworkErrorPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'network-error.html',
})
export class NetworkErrorPage {
  constructor(public nav: NavController,
  private connectivity: Connectivity,
  private alertc: AlertController
  ) {
    this.addConnectivityListeners();
    this.presentError();
  }

  presentError() {
  let alert = this.alertc.create({
    title: '警告',
    message: '网络连接错误，重试?',
    buttons: [
      {
        text: '取消',
        role: 'cancel',
        handler: () => {
          alert.dismiss();
        }
      },
      {
        text: '重试',
        handler: () => {
          alert.dismiss().then(res=> this.refresh())
        }
      }
    ]
  });
  alert.present();
}

 refresh() {
    //this.addConnectivityListeners();
    console.log("Google maps JavaScript needs to be loaded.");
    if (this.connectivity.isOnline()) {
      
      this.connectivity.loadJs();
      this.nav.setRoot(TabsPage);
      
    } else {
      console.log("Network Offline: load error page")
      
    }
  }
 
  addConnectivityListeners() {


    let onOnline = function () {
      setTimeout(function () {
        if (typeof google == "undefined" || typeof google.maps == "undefined") {
          this.connectivity.loadJs();
          // let script = document.createElement("script");
          // //script.id = "googleMaps";
          // script.src = "http://ditu.google.cn/maps/api/js?&amp;libraries=places&amp;language=zh-cn";
          // document.body.appendChild(script);

        } 
          this.nav.setRoot(TabsPage);
        
      }, 2000);
    };

    let onOffline = function () {
       this.nav.setRoot(NetworkErrorPage);
    };

    document.addEventListener('online', onOnline, false);
    document.addEventListener('offline', onOffline, false);

  }
}
