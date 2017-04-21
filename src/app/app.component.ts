import {ViewChild, Component} from '@angular/core';
import {Events, Platform, Nav, MenuController} from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

//import {AccountPage} from '../pages/account/account';
import {TabsPage} from '../pages/tabs/tabs';

import {NetworkErrorPage} from '../pages/network-error/network-error';
//import {HouselistSearch} from '../pages/houselist-search/houselist-search'
//import {ConferenceData} from './providers/conference-data';
import {UserData} from '../providers/user-data';
//import {MapleRestData} from '../providers/maple-rest-data/maple-rest-data';
import {Connectivity} from '../providers/connectivity';
import {MapleConf} from '../providers/maple-rest-data/maple-config';
import {AuthService} from '../providers/auth/auth';
import {UpdateService} from '../providers/update';

export interface PageObj {
  title: string;
  component: any;
  icon: string;
  index?: number;
}

@Component({
  templateUrl: 'app.html',

})

export class MapleApp {

  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageObj[] = [


    { title: '首页', component: TabsPage, icon: 'home' },
    { title: '地图搜索', component: TabsPage, index: 1, icon: 'map' },
    { title: '学区房', component: TabsPage, index: 2, icon: 'school' },
    { title: '项目推荐', component: TabsPage, index: 3, icon: 'thumbs-up' },
    { title: '房源统计', component: TabsPage, index: 4, icon: 'stats' },
    { title: '关于我们', component: TabsPage, index: 5, icon: 'information-circle' },

  ];

  rootPage: any = TabsPage;
  constructor(
    private events: Events,
    public userData: UserData,
    private menu: MenuController,
    platform: Platform,
    mapleconf: MapleConf,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    public connectivity: Connectivity,
    private auth: AuthService,
    private update: UpdateService
    //confData: ConferenceData
  ) {
    // Call any initial plugins when ready
    platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.update.newUpdate();
      auth.startupTokenRefresh();
    });

    // load the conference data
    //confData.load();

    // decide which menu items should be hidden by current login status stored in local storage
    // this.userData.hasLoggedIn().then((hasLoggedIn) => {
    //   this.enableMenu(hasLoggedIn == 'true');
    // });

    this.listenEvents();
    this.checkConnectivity();
  }
  

  openPage(page: PageObj) {
    // the nav component was found using @ViewChild(Nav)
    // reset the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      this.nav.setRoot(page.component, { tabIndex: page.index });


    } else {
      this.nav.setRoot(page.component);
    }

    if (page.title === 'Logout') {
      // Give the menu time to close before changing to logged out
      setTimeout(() => {
        this.userData.logout();
      }, 1000);
    }
  }

  listenEvents() {
  
     this.events.subscribe('profile:login', (data) => {

      setTimeout(() => {
        this.auth.login();
        //this.nav.setRoot(TabsPage, { tabIndex: 4});
      }, 300);
    });

    this.events.subscribe('map:center', (data) => {

     setTimeout(() => {
       console.log(data);
        this.nav.setRoot(TabsPage, { tabIndex: 1, rootParms: data });
      }, 300);
    });
    this.events.subscribe('schoolmap:center', (data) => {
     setTimeout(() => {
        this.nav.setRoot(TabsPage, { tabIndex: 2, rootParms: data });
      }, 1000);



    });
  }

  enableMenu(loggedIn) {
    this.menu.enable(loggedIn, "loggedInMenu");
    this.menu.enable(!loggedIn, "loggedOutMenu");
  }

  checkConnectivity() {
    //this.addConnectivityListeners();
    //console.log("Google maps JavaScript needs to be loaded.");
    if (this.connectivity.isOnline()) {
      this.connectivity.loadJs();

    } else {
     // console.log("Network Offline: load error page")
      this.rootPage = NetworkErrorPage;
    }
  }

}
