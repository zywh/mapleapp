import { NgModule } from '@angular/core';
import { IonicApp, IonicModule, DeepLinkConfig } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MapleApp } from './app.component';
import { Http } from '@angular/http'
import { AuthHttp, AuthConfig } from 'angular2-jwt';

//import service and compoment
import { UserData } from '../providers/user-data';
import { MapleConf } from '../providers/maple-rest-data/maple-config';
import { MapleRestData } from '../providers/maple-rest-data/maple-rest-data';
import { Connectivity } from '../providers/connectivity';
import { AuthService } from '../providers/auth/auth';
import { UpdateService } from '../providers/update';
import { ShareService } from '../providers/share';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { HouseList } from '../components/house-list/house-list';
import { Search } from '../components/search/search';


//import pages
import {AboutPage} from '../pages/about/about';

import {FavoritePage} from '../pages/favorite/favorite';
import {HelpPage} from '../pages/help/help';
import {HomePage} from '../pages/home/home';
import {HouseCityStatsPage} from '../pages/house-city-stats/house-city-stats';
import {CityStats} from '../pages/house-city-stats/city-stats';

import {HouseDetailPage} from '../pages/house-detail/house-detail';
import {HouselistSearch} from '../pages/houselist-search/houselist-search';
import {SelectOptionModal} from '../pages/map-search/map-option-modal';
import {MapHouselist} from '../pages/map-search/map-houselist';
import {MapSearchPage} from '../pages/map-search/map-search';
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
import {chartStats} from '../pages/stats/chartStats';


const cloudSettings: CloudSettings = {
  // "枫之都" @ionic.io
  'core': {
    'app_id': 'aab7d6de'
  }
};

export const deepLinkConfig: DeepLinkConfig = {
  links: [
    { component: TabsPage, name: '主页', segment: 'home' },
    { component: HouseDetailPage, name: '房源详情', segment: 'housedetail/:id／:list', defaultHistory: [ TabsPage ] }
  ]
};

export function authFactory(http: any) {
   return new AuthHttp(new AuthConfig({ noJwtError: true }), http);
};

@NgModule({
  declarations: [
   
    HouseList,
    Search,
    MapleApp,
    AboutPage,
    FavoritePage,
    HelpPage,
    HomePage,
    HouseCityStatsPage,
    HouseDetailPage,
    MapSearchPage,
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
    TabsPage,
    chartStats,
    CityStats

  ],
  imports: [
    IonicModule.forRoot(MapleApp, {
      tabPlacement: "bottom",
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
      },
      deepLinkConfig
    }),
    CloudModule.forRoot(cloudSettings),
    //HouseList,
    //Search
  ],
  bootstrap: [IonicApp],
  entryComponents: [
   
    HouseList,
    Search,
    MapleApp,
    AboutPage,
    FavoritePage,
    HelpPage,
    HomePage,
    HouseCityStatsPage,
    HouseDetailPage,
    MapSearchPage,
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
    TabsPage,
    chartStats,
    CityStats,
  ],
  providers: [
    Storage,
    UserData,
    MapleRestData,
    MapleConf,
    Connectivity,
    {
      provide: AuthHttp,
      // useFactory: (http) => {
      //   return new AuthHttp(new AuthConfig({ noJwtError: true }), http);
      // },
      useFactory: authFactory,
      deps: [Http]
    },
    AuthService,
    UpdateService,
    ShareService],
})
export class AppModule { }