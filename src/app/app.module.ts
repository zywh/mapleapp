import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';
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


//import pages
import {AboutPage} from '../pages/about/about';
import {FavoritePage} from '../pages/favorite/favorite';
import {HelpPage} from '../pages/help/help';
import {HomePage} from '../pages/home/home';
import {HouseCityStatsPage} from '../pages/house-city-stats/house-city-stats';
import {LoginPage} from '../pages/login/login';

import {HouseDetailPage} from '../pages/house-detail/house-detail';
import {HouselistSearch} from '../pages/houselist-search/houselist-search';
import {SelectOptionModal} from '../pages/map-search/map-option-modal';
import {MapHouselist} from '../pages/map-search/map-houselist';
import {SchoolSelectOptionModal} from '../pages/school-map/schoolmap-option-modal';
import {SchoolListModal} from '../pages/school-map/school-list-modal';
import {MyCenterPage} from '../pages/my-center/my-center';
import {NetworkErrorPage} from '../pages/network-error/network-error';
import {PostPage} from '../pages/post/post';
import {ProfilePage} from '../pages/profile/profile';
import {ProjectDetailPage} from '../pages/project-detail/project-detail';
import {ProjectsPage} from '../pages/projects/projects';
import {SettingsPage} from '../pages/settings/settings';
import {StatsPage} from '../pages/stats/stats';
import { TabsPage } from '../pages/tabs/tabs';


const cloudSettings: CloudSettings = {
  // "枫之都" @ionic.io
  'core': {
    'app_id': 'aab7d6de'
  }
};

@NgModule({
  declarations: [
    MapleApp,
    AboutPage,
    FavoritePage,
    HelpPage,
    HomePage,
    HouseCityStatsPage,
    LoginPage,
    HouseDetailPage,
    HouselistSearch,
    SelectOptionModal,
    MapHouselist,
    SchoolSelectOptionModal,
    SchoolListModal,
    MyCenterPage,
    NetworkErrorPage,
    PostPage,
    ProfilePage,
    ProjectDetailPage,
    ProjectsPage,
    SettingsPage,
    StatsPage,
    TabsPage

  ],
  imports: [
    IonicModule.forRoot(MapleApp, {
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
    }),
    CloudModule.forRoot(cloudSettings),
    HouseList,
    Search
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MapleApp,
    AboutPage,
    FavoritePage,
    HelpPage,
    HomePage,
    HouseCityStatsPage,
    LoginPage,
    HouseDetailPage,
    HouselistSearch,
    SelectOptionModal,
    MapHouselist,
    SchoolSelectOptionModal,
    SchoolListModal,
    MyCenterPage,
    NetworkErrorPage,
    PostPage,
    ProfilePage,
    ProjectDetailPage,
    ProjectsPage,
    SettingsPage,
    StatsPage,
    TabsPage
  ],
  providers: [
    Storage,
    UserData,
    MapleRestData,
    MapleConf,
    Connectivity,
    {
      provide: AuthHttp,
      useFactory: (http) => {
        return new AuthHttp(new AuthConfig({ noJwtError: true }), http);
      },
      deps: [Http]
    },
    AuthService,
    UpdateService],
})
export class AppModule { }