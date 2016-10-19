import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular';
import {Network} from 'ionic-native';


@Injectable()
export class Connectivity {

  onDevice: boolean;

  constructor(public platform: Platform) {
    this.onDevice = this.platform.is('cordova');
  }

  isOnline(): boolean {

    if (this.onDevice && Network.connection) {
      return Network.connection !== 'none';

    } else {

      return navigator.onLine;

    }


  }

  isOffline(): boolean {
    if (this.onDevice && Network.connection) {
      return Network.connection === 'none';
    } else {
      return !navigator.onLine;
    }
  }

  loadJs(){
       window['mapInit'] = () => {
      
        let script = document.createElement("script");
        script.src = "assets/extjs/richmarker.js";
        console.log("Load Richmarker JS")
        document.body.appendChild(script);


      }
      let script = document.createElement("script");
      script.id = "googleMaps";
      script.src = "http://ditu.google.cn/maps/api/js?&amp;libraries=places&amp;language=zh-cn&callback=mapInit";
      document.body.appendChild(script);
  }

  

}

