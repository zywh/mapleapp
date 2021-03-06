import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';
//declare var Connection;
declare var google;

@Injectable()
export class Connectivity {

  onDevice: boolean;

  constructor(public platform: Platform,private network: Network) {
    this.onDevice = this.platform.is('cordova');
  }

  isOnline(): boolean {
    if (this.onDevice && this.network.type) {
      return this.network.type !== "none";
    } else {
      return navigator.onLine;
    }
  }

  isOffline(): boolean {
    if (this.onDevice && this.network.type) {
      return this.network.type === "none";
    } else {
      return !navigator.onLine;
    }
  }

  loadJs(): Promise<any> {
    return new Promise((resolve) => {
      window['mapInit'] = () => {

        let script = document.createElement("script");
        //script.src = "/assets/extjs/richmarker.js";  //absolute path break runn ONLY in IOS phone. Works in browser and simulator
        script.src = "assets/extjs/richmarker.js";
        console.log("Load Richmarker JS")
        document.body.appendChild(script);
        setTimeout(function() {
           resolve(true);
        }, 1000);
         
       


      }
      let script = document.createElement("script");
      script.id = "googleMaps";
      script.src = "http://ditu.google.cn/maps/api/js?&amp;libraries=places&amp;language=zh-cn&callback=mapInit";
      document.body.appendChild(script);
    })
  }





}

