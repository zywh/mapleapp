import {Injectable} from '@angular/core';
import {Storage, LocalStorage, Events, ToastController, AlertController} from 'ionic-angular';
import {AuthService} from './auth/auth';
import {MapleRestData} from './maple-rest-data/maple-rest-data';
import {MapleConf} from './maple-rest-data/maple-config';
//import * as PouchDB from 'pouchdb';
//declare var PouchDB: any;


@Injectable()
export class UserData {
  _favorites = [];
  _routes = [];
  _defaultCenter: Object;
  _houseSearchDefault: Object;
  _schoolSearchDefault: Object;
  HAS_LOGGED_IN = 'hasLoggedIn';
  storage: Storage;

  //fbid: number;
  username: string;
  //picture: string;
  db: any;
  data: any;
  cloudantUsername: string;
  cloudantPassword: string;
  remote: string;
  constructor(
    private events: Events,
    private auth: AuthService,
    private toastCtrl: ToastController,
    private mapleRestData: MapleRestData,
    private mapleConf: MapleConf,
    private alertc: AlertController)
  { }



  loginAlert() {


    let alert = this.alertc.create({
      title: '提示',
      message: '请登录后使用此功能',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '登录',
          handler: () => {
            alert.dismiss().then(res => {
              this.events.publish('profile:login');

            })

          }
        }
      ]
    });
    alert.present();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 1000,
      position: 'bottom'
      //dismissOnPageChange: true
    });


    toast.present();
  }

  hasFavorite(mls): Promise<any> {
    //type houseFav for houseFav and type routeFav for RouteFav, check boolean before update
    //return (this._favorites.indexOf(mls) > -1);
    return new Promise(resolve => {

      this.mapleConf.load().then(res => {
        let rest = res.checkFavDataRest;
        console.log(rest)

        let parms = { username: this.auth.user['email'], mls: mls }
        this.mapleRestData.load(rest, parms).subscribe(
          data => {
            // console.log(data.Data); 
            console.log("HasFav: MLS:" + mls + "Result:" + data);
            return resolve(data);
          });

      });
    })


  }

  favWrapper(mls, type) {
    //check if user is logged in
    return new Promise(resolve => {

      if (this.auth.authenticated()) {

        this.hasFavorite(mls).then(res => {
          console.log("Has Fav return:" + res)
          let result: Boolean = false;
          if (type == 'houseFav') { result = res.houseFav }
          if (type == 'routeFav') { result = res.routeFav }

          //check if mls# is in fav list
          if (result) { //result is 1, delete favorite
            this.changeFavorite(mls, type, 1).then(res => {
              this.presentToast("删除收藏(" + mls + ")成功!")
              resolve("D");
            });
          } else {//result is 0, delete favorite
            this.changeFavorite(mls, type, 2).then(res => {
              this.presentToast("添加收藏(" + mls + ")成功!")
              resolve("C");
            })

          }
        })


      } else { //not authenticated , present alert window

        this.loginAlert();
        resolve("L");
      }

    })




  }

  changeFavorite(mls, type, action) {
    //action = 1 (add), action = 2 (delete)
    return new Promise(resolve => {
      this.mapleConf.load().then(res => {
        let rest: String;
        if (action == 1) { rest = res.addUserDataRest; }
        if (action == 2) { rest = res.deleteUserDataRest; }


        let parms = { username: this.auth.user['email'], mls: mls, type: type }
        this.mapleRestData.load(rest, parms).subscribe(
          data => {
            console.log(data); 
            return resolve(data);
          }

        );
      })

    })

  }



  // removeFavorite(mls, type) {
  //   // let index = this._favorites.indexOf(mls)
  //   // if (index > -1) {
  //   //   this._favorites.splice(index, 1);
  //   // }
  //      return new Promise(resolve => {
  //     this.mapleConf.load().then(res => {
  //       let rest = res.deleteUserDataRest;
  //       let parms = { username: this.auth.user['email'],mls:mls, type: type }
  //       this.mapleRestData.load(rest, parms).subscribe(
  //         data => {
  //           // console.log(data.Data); 
  //           return resolve(data.Data);
  //         }

  //       );
  //     })

  //   })

  // }

  getUserData(type): Promise<any> {

    return new Promise(resolve => {
      this.mapleConf.load().then(res => {
        let rest = res.getUserDataRest;
        let parms = { username: this.auth.user['email'], type: type }
        this.mapleRestData.load(rest, parms).subscribe(
          data => {
            // console.log(data.Data); 
            return resolve(data.Data);
          }

        );
      })

    })


  }

  login(username) {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUsername(username);
    this.events.publish('user:login');
  }

  signup(username) {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUsername(username);
    this.events.publish('user:signup');
  }

  logout() {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove("username");
    this.events.publish('user:logout');
  }

  setUsername(username) {
    this.storage.set("username", username);
  }

  getUsername() {
    return this.storage.get("username").then((value) => {
      return value;
    });
  }

  // return a promise
  hasLoggedIn() {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value;
    });
  }

}
