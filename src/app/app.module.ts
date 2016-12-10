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
import { SchoolListComponent} from '../components/school-list/school-list';
import { HouseCityStatsComponent} from '../components/house-city-stats/house-city-stats';
import { SimpleMapComponent} from '../components/simple-map/simple-map';
import { MapleMapSearchComponent} from '../components/maple-map-search/maple-map-search';
import {HouseDetailViewComponent} from '../components/house-detail-view/house-detail-view';
import { Search } from '../components/search/search';
import { ElasticHeader } from '../components/elastic-header/elastic-header';
import {SelectOptionModal} from '../components/maple-map-search/map-option-modal';


//import pages
import {AboutPage} from '../pages/about/about';
import {FavoritePage} from '../pages/favorite/favorite';
import {HelpPage} from '../pages/help/help';
import {HomePage} from '../pages/home/home';
import {CityStats} from '../pages/house-city-stats/city-stats';
import {HouseDetailPage} from '../pages/house-detail/house-detail';
import {HouselistSearch} from '../pages/houselist-search/houselist-search';

import {MapSearchPage} from '../pages/map-search/map-search';
import {MapSearchNewPage} from '../pages/map-search-new/map-search-new';
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

//import house detail tab pages

import {HouseDetailTabsPage} from '../pages/house-detail-tabs/house-detail-tabs';
import {HouseDetailMapPage} from '../pages/house-detail-tabs/house-detail-map';
import {SimilarHousesPage} from '../pages/house-detail-tabs/similar-houses';
import {CommunityStatsPage} from '../pages/house-detail-tabs/community-stats';
import {HouseDetailMainPage} from '../pages/house-detail-tabs/house-detail-main';

const cloudSettings: CloudSettings = {
  // "枫之都" @ionic.io
  'core': {
    'app_id': 'aab7d6de'
  }
};

let storage: Storage = new Storage();

export const deepLinkConfig: DeepLinkConfig = {
  links: [
    { component: HouseDetailPage, name: '房源详情', segment: 'housedetail/:id' },
    { component: HouseDetailPage, name: '房源详情2', segment: 'housedetail/:id/:VOWtoken' },
    { component: ProjectDetailPage, name: '项目详情', segment: 'projectdetail/:id' },
    { component: ProjectsPage, name: '项目', segment: 'projects' },
    { component: MapSearchPage, name: '地图找房', segment: 'mapsearch/:pageType' }
  ]
};

export function authFactory(http: any) {
   return new AuthHttp(new AuthConfig({  globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => storage.get('id_token')),noJwtError: true }), http);
};

@NgModule({
  declarations: [
   
    HouseList,
    SchoolListComponent,
    HouseCityStatsComponent,
    SimpleMapComponent,
    HouseDetailViewComponent,
    MapleMapSearchComponent,
    Search,
    MapleApp,
    AboutPage,
    ElasticHeader,
    FavoritePage,
    HelpPage,
    HomePage,
    HouseDetailPage,
    MapSearchPage,
    MapSearchNewPage,
    HouselistSearch,
    SelectOptionModal,
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
    HouseDetailTabsPage,
    HouseDetailMapPage,
    HouseDetailMainPage,
    SimilarHousesPage,
    CommunityStatsPage

  ],
  imports: [
    IonicModule.forRoot(MapleApp, {
       tabPlacement: "bottom",
       backButtonText: "返回",
       //backButtonText: "",
       prodMode: true,
       //tabSubPages: false, //android house detail has two header bar
       //mode: 'ios',
       //temp padding to fix ionic view status bar overlapping
       platforms: {
         ios: {
            statusbarPadding: false
  
          },
       }
      },deepLinkConfig),
    CloudModule.forRoot(cloudSettings),
  
  ],
  bootstrap: [IonicApp],
  entryComponents: [
   
    HouseList,
    SchoolListComponent,
    HouseCityStatsComponent,
    SimpleMapComponent,
    HouseDetailViewComponent,
    MapleMapSearchComponent,
    Search,
    MapleApp,
    AboutPage,
    FavoritePage,
    HelpPage,
    HomePage,
    HouseDetailPage,
    MapSearchPage,
    MapSearchNewPage,
    HouselistSearch,
    SelectOptionModal,
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
     HouseDetailTabsPage,
    HouseDetailMapPage,
    HouseDetailMainPage,
    SimilarHousesPage,
    CommunityStatsPage
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