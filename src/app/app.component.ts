import {ViewChild, Component,Type,provide} from '@angular/core';
import {Http} from '@angular/http'
import {ionicBootstrap, Events, Platform, Nav, MenuController} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {AccountPage} from '../pages/account/account';
import {TabsPage} from '../pages/tabs/tabs';
import {LoginPage} from '../pages/login/login';
import {SignupPage} from '../pages/signup/signup';
import {SettingsPage} from '../pages/settings/settings';
import {ProfilePage} from '../pages/profile/profile';
import {NetworkErrorPage} from '../pages/network-error/network-error';
import {HouselistSearch} from '../pages/houselist-search/houselist-search'
//import {ConferenceData} from './providers/conference-data';
import {UserData} from '../providers/user-data';
import {MapleRestData} from '../providers/maple-rest-data/maple-rest-data';
import {Connectivity} from '../providers/connectivity/connectivity';
import {MapleConf} from '../providers/maple-rest-data/maple-config';
import {AuthHttp, AuthConfig} from 'angular2-jwt';
import {AuthService} from '../providers/auth/auth';
import {UpdateService} from '../providers/update/update';


interface PageObj {
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
    public connectivity: Connectivity,
    private auth: AuthService,
    private update: UpdateService
    //confData: ConferenceData
  ) {
    // Call any initial plugins when ready
    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
      this.update.newUpdate();
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
    // this.events.subscribe('user:login', () => {
    //   this.enableMenu(true);
    // });

    // this.events.subscribe('user:signup', () => {
    //   this.enableMenu(true);
    // });

    // this.events.subscribe('user:logout', () => {
    //   this.enableMenu(false);
    // });
     this.events.subscribe('profile:login', (data) => {

      setTimeout(() => {
        this.nav.setRoot(TabsPage, { tabIndex: 4});
      }, 300);
    });

    this.events.subscribe('map:center', (data) => {

     // setTimeout(() => {
        this.nav.setRoot(TabsPage, { tabIndex: 1, rootParms: data[0] });
     // }, 300);
    });
    this.events.subscribe('schoolmap:center', (data) => {
     setTimeout(() => {
        this.nav.setRoot(TabsPage, { tabIndex: 2, rootParms: data[0] });
      }, 1000);



    });
  }

  enableMenu(loggedIn) {
    this.menu.enable(loggedIn, "loggedInMenu");
    this.menu.enable(!loggedIn, "loggedOutMenu");
  }
  checkConnectivity() {
    //this.addConnectivityListeners();
    console.log("Google maps JavaScript needs to be loaded.");
    if (this.connectivity.isOnline()) {
      this.connectivity.loadJs();

    } else {
      console.log("Network Offline: load error page")
      this.rootPage = NetworkErrorPage;
    }
  }


}


ionicBootstrap(
  MapleApp,
  [
  provide(AuthHttp, {
    useFactory: (http) => {
      return new AuthHttp(new AuthConfig({noJwtError: true}), http);
    },
    deps: [Http]
  })],
  {
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

  }
);