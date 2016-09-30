import {Injectable} from '@angular/core';
import {Events, ToastController, AlertController} from 'ionic-angular';
import {AuthService} from './auth/auth';
import {MapleRestData} from './maple-rest-data/maple-rest-data';
import {MapleConf} from './maple-rest-data/maple-config';
//import {LoginPage} from '../pages/login/login';
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
    private alertc: AlertController
    //private nav: NavController

  )
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
              // this.nav.push(LoginPage);


            })

          }
        }
      ]
    });
    alert.present();
  }

  addCenterAlert(lat, lng, msg) {
    let prompt = this.alertc.create({

      message: msg,
      inputs: [
        {
          name: 'name',
          placeholder: '我的位置名称'
        },
      ],
      buttons: [
        {
          text: '取消',
          handler: data => {
            console.log('Cancel clicked');
            this.events.publish('locate:dismiss');
          }
        },
        {
          text: '保存',
          handler: data => {
            this.saveCenter('myCenter', data.name, lat, lng);
             this.events.publish('locate:dismiss');
          }
        }
      ]
    });

    return new Promise(resolve => {
    prompt.present().then(res=>{
      console.log("alert is dismissed");
      return resolve(res);
    });
    })
  }


  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 1000,
      position: 'bottom'
      //dismissOnPageChange: true
    });
    toast.onDidDismiss(() => {
      console.log("Toast is dismissed publish event")
      this.events.publish('toast:dismiss');
    });

    toast.present();
  }


  saveCenter(type, name, lat, lng) {
    this.mapleConf.load().then(res => {
      let rest = res.updateCenterDataRest;
      let data = JSON.stringify({ name: name, lat: lat, lng: lng })
      let parms = { username: this.auth.user['email'], data: data, type: type, action: 'c' };
      this.mapleRestData.load(rest, parms).subscribe(
        data => {
          // console.log(data.Data); 
          console.log("SaveCenter Return:" + data)
          // if (data > 0) {
          //   this.presentToast("我的位置:" + name + "保存成功");
          // } else {
          //   this.addCenterAlert(name, "名字已经用过，请更改名字");
          // }


        });

    });

  }

  centerReorder(type, list) {

    this.mapleConf.load().then(res => {
      let rest = res.updateCenterDataRest;
      let data = JSON.stringify(list);
      let parms = { username: this.auth.user['email'], data: data, type: type, action: 'r' };
      this.mapleRestData.load(rest, parms).subscribe(
        data => {
            console.log("SaveCenter Reroder:" + data)
       
        });

    });

  }
  deleteCenter(type, center) {
    return new Promise(resolve => {
      this.mapleConf.load().then(res => {
        let rest = res.updateCenterDataRest;
        let data = JSON.stringify(center);
        let parms = { username: this.auth.user['email'], data: data, type: type, action: 'd' };
        this.mapleRestData.load(rest, parms).subscribe(data => { return resolve(data); });

      });
    })
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

  getFavCount() {
    return new Promise(resolve => {
      this.mapleConf.load().then(res => {
        let rest = res.getFavCountDataRest;
        let parms = { username: this.auth.user['email'] };
        this.mapleRestData.load(rest, parms).subscribe(
          data => {
            return resolve(data);
          });
      });
    });

  }

  favWrapper(mls, type) {
    //check if user is logged in
    return new Promise(resolve => {

      if (this.auth.authenticated()) {

        this.hasFavorite(mls).then(res => {
          console.log(res)
          let result: Boolean = false;
          if (type == 'houseFav') { result = res.houseFav }
          if (type == 'routeFav') { result = res.routeFav }

          //check if mls# is in fav list
          if (result) { //result is 1, delete favorite
            this.changeFavorite(mls, type, "d").then(ret => {
              this.presentToast("删除收藏(" + mls + ")成功!")
              resolve("D");
            });
          } else {//result is 0, add favorite
            this.changeFavorite(mls, type, "c").then(ret => {
              if (ret == 99)
                this.presentToast("已超过最多可收藏数－－失败！")
              else
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

  changeFavorite(data, type, action) {
    //action = 1 (add), action = 2 (delete)
    //type houseFav,routerFav,myCenter
    return new Promise(resolve => {
      this.mapleConf.load().then(res => {
        let rest = res.updateUserDataRest;

        let parms = { username: this.auth.user['email'], mls: data, type: type, action: action }

        this.mapleRestData.load(rest, parms).subscribe(
          ret => {
            console.log("changefav action:" + action + ' type:' + type + " Data:" + data + " Return:" + ret);
            return resolve(ret);
          });
      });

    });

  }

  saveSelectOption(options, type) {
    if (this.auth.authenticated()) {
      return new Promise(resolve => {
        this.mapleConf.load().then(res => {
          let rest = res.saveOptionsDataRest;
          let parms = { username: this.auth.user['email'], data: options, type: type };
          console.log(parms);
          this.mapleRestData.load(rest, parms).subscribe(data => {
            this.presentToast("搜索条件保存成功")
            return resolve(data);
          });
        });

      });


    } else {
      this.loginAlert();
    }

  }



  getUserSelections(type) {

    return new Promise(resolve => {
      this.getUserData(type).then(res => {
        return resolve(JSON.parse(res));
      })

    })

  }


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
