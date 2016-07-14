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

}

