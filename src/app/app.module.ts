import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MapleApp } from './app.component';
import { Http } from '@angular/http'
import { AuthHttp, AuthConfig } from 'angular2-jwt';

//import {ConferenceData} from '../providers/conference-data';
import { UserData } from '../providers/user-data';
import { MapleConf } from '../providers/maple-rest-data/maple-config';
import { MapleRestData } from '../providers/maple-rest-data/maple-rest-data';
import { Connectivity } from '../providers/connectivity/connectivity';
import { AuthService } from '../providers/auth/auth';
import { UpdateService } from '../providers/update/update';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { HouseList } from '../components/house-list/house-list';
import { Search } from '../components/search/search';

import { HomePage } from '../pages/home/home';

const cloudSettings: CloudSettings = {
  // "枫之都" @ionic.io
  'core': {
    'app_id': 'aab7d6de'
  }
};


@NgModule({
  declarations: [
    MapleApp,
    HomePage
  ],
  imports: [
    IonicModule.forRoot(MapleApp,   {
        tabbarPlacement: "bottom",
        //backButtonText: "返回",
        backButtonText: "",
        prodMode: true,
        //tabSubPages: false, //android house detail has two header bar
        //mode: 'ios',
        //temp padding to fix ionic view status bar overlapping
        platforms: {
            ios: {
                statusbarPadding: false

            },
        }
      } ),
    CloudModule.forRoot(cloudSettings),
    HouseList,
    Search
      ],
  bootstrap: [IonicApp],
  entryComponents: [
    MapleApp,
    HomePage
  ],
  providers: [UserData, 
    MapleRestData, 
    MapleConf, 
    Connectivity,
    { provide: AuthHttp, 
        useFactory: (http) => {
        return new AuthHttp(new AuthConfig({noJwtError: true}), http);
        },
        deps: [Http]
    },
    AuthService,
    UpdateService],
})
export class AppModule {}