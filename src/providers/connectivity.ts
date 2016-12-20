import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Network } from 'ionic-native';
//declare var Connection;
declare var google;

@Injectable()
export class Connectivity {

  onDevice: boolean;

  constructor(public platform: Platform) {
    this.onDevice = this.platform.is('cordova');
  }

  isOnline(): boolean {
    if (this.onDevice && Network.connection) {
      return Network.connection !== "none";
    } else {
      return navigator.onLine;
    }
  }

  isOffline(): boolean {
    if (this.onDevice && Network.connection) {
      return Network.connection === "none";
    } else {
      return !navigator.onLine;
    }
  }

  loadJs(): Promise<any> {
    return new Promise((resolve) => {
      window['mapInit'] = () => {

        let script = document.createElement("script");
        script.src = "assets/extjs/richmarker.js"; //remove slash in front.!!! Cause no marker js loaded in IOS
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