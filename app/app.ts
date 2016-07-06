import {ViewChild, Component} from '@angular/core';
import {ionicBootstrap, Events, Platform, Nav, MenuController} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {ConferenceData} from './providers/conference-data';
import {UserData} from './providers/user-data';
import {MapleRestData} from './providers/maple-rest-data/maple-rest-data';
import {Connectivity} from './providers/connectivity/connectivity';
import {AccountPage} from './pages/account/account';
import {TabsPage} from './pages/tabs/tabs';
import {LoginPage} from './pages/login/login';
import {SignupPage} from './pages/signup/signup';
import {TutorialPage} from './pages/tutorial/tutorial';
import {NetworkErrorPage} from './pages/network-error/network-error';
import {HouselistSearch} from './pages/houselist-search/houselist-search'
// import {MapSearchPage} from './pages/map-search/map-search';
// import {ProjectsPage} from './pages/projects/projects';
// import {SchoolSearchPage} from './pages/school-search/school-search';
// import {SchoolMapPage} from './pages/school-map/school-map';
// import {StatsPage} from './pages/stats/stats';
// import {AboutPage} from './pages/about/about';
// import {PostPage} from './pages/post/post';
// import {HomePage} from './pages/home/home';
import {MapleConf} from './providers/maple-rest-data/maple-config';

interface PageObj {
  title: string;
  component: any;
  icon: string;
  index?: number;
}

@Component({
  templateUrl: 'build/app.html',

})

class MapleApp {

  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageObj[] = [

    // { title: '首页', component: HomePage, icon: 'information-circle' },
    // { title: '地图搜索', component: MapSearchPage, icon: 'information-circle' },
    // { title: '学区房', component: SchoolSearchPage, icon: 'information-circle' },
    // { title: '项目推荐', component: ProjectsPage, icon: 'information-circle' },
    // { title: '房源统计', component: StatsPage, icon: 'information-circle' },
    { title: '首页', component: TabsPage, icon: 'home' },
    { title: '地图搜索', component: TabsPage, index: 1, icon: 'map' },
    { title: '学区房', component: TabsPage, index: 2, icon: 'school' },
    { title: '项目推荐', component: TabsPage, index: 3, icon: 'thumbs-up' },
    { title: '房源统计', component: TabsPage, index: 4, icon: 'stats' },
    { title: '列表搜索', component: HouselistSearch, icon: 'list' },
    { title: '关于我们', component: TabsPage, index: 5, icon: 'information-circle' },

  ];

  loggedInPages: PageObj[] = [
    { title: 'Account', component: AccountPage, icon: 'person' },
    { title: 'Logout', component: TabsPage, icon: 'log-out' }
  ];
  loggedOutPages: PageObj[] = [
    { title: 'Login', component: LoginPage, icon: 'log-in' },
    { title: 'Signup', component: SignupPage, icon: 'person-add' }
  ];
  //rootPage: any = TutorialPage;
  // rootPage: any = ProjectsPage;
  //rootPage: any = HomePage;
  //rootPage: any = TabsPage;
  rootPage: any;
  constructor(
    private events: Events,
    private userData: UserData,
    private menu: MenuController,
    platform: Platform,
    mapleconf: MapleConf,
    private connectivity: Connectivity
    //confData: ConferenceData
  ) {
    // Call any initial plugins when ready
    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });

    // load the conference data
    //confData.load();

    // decide which menu items should be hidden by current login status stored in local storage
    this.userData.hasLoggedIn().then((hasLoggedIn) => {
      this.enableMenu(hasLoggedIn == 'true');
    });

    this.listenToLoginEvents();
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

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
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
      console.log("online, loading map");
      let script = document.createElement("script");
      script.id = "googleMaps";
      script.src = "http://ditu.google.cn/maps/api/js?&amp;libraries=places&amp;language=zh-cn";
      document.body.appendChild(script);
      // let script1 = document.createElement("script");
      // script1.src = "extjs/richmarker.js";
      // document.body.appendChild(script1);
      this.rootPage = TabsPage;
      // this.rootPage = NetworkErrorPage;
    } else {
      console.log("Network Offline: load error page")
      this.rootPage = NetworkErrorPage;
    }
  }
 
}

ionicBootstrap(
  MapleApp,
  [ConferenceData, UserData, MapleRestData, MapleConf, Connectivity],
  {
    tabbarPlacement: "bottom",
    //backButtonText: "返回",
    backButtonText: "",
    prodMode: true,
    tabSubPages: false, //android house detail no two header bar
    //mode: 'ios',
    //temp padding to fix ionic view status bar overlapping
    platforms: {
      ios: {
        statusbarPadding: true
      },
    }

  }
);
