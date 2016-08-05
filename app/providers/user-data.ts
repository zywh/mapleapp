import {Injectable} from '@angular/core';
import {Storage, LocalStorage, Events, ToastController, AlertController} from 'ionic-angular';
import {AuthService} from './auth/auth';
import * as PouchDB from 'pouchdb';
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
    private alertc: AlertController) {
    //this.storage = new Storage(SqlStorage, { name: 'maplecity' });

    this.db = new PouchDB('mapleapp');
    this.cloudantUsername = 'heyedimedsoicknotheavalm';
    this.cloudantPassword = '9c84c07ba29b0747736acdf7d512d7e392f54eb6';
    this.remote = 'https://ee4f85e1-81a5-40bf-ac41-a08248a11b18-bluemix.cloudant.com/mapleapp';
    let options = {
      live: true,
      retry: true,
      continuous: true,
      auth: {
        username: this.cloudantUsername,
        password: this.cloudantPassword
      }
    };
    this.db.sync(this.remote, options);
  }

  addDocument(d) {
    console.log(d);
    this.db.put(d);

  }
  getFavHouses(username): Promise<any> {

    return new Promise(resolve => {

      // this.db.allDocs({

      //   include_docs: true,
      //   limit: 30,
      //   descending: true

      this.db.query('_design/username', { username: username })
        .then((result) => {

          this.data = [];
          console.log(result);

          let docs = result.rows.map((row) => {
            this.data.push(row.doc);

          });

          //this.data.reverse();

          resolve(this.data);

          this.db.changes({ live: true, since: 'now', include_docs: true }).on('change', (change) => {
            this.handleChange(change);
          });

        }).catch((error) => {

          console.log(error);

        });

    });

  }

  handleChange(change): void {

    let changedDoc = null;
    let changedIndex = null;

    this.data.forEach((doc, index) => {

      if (doc._id === change.id) {
        changedDoc = doc;
        changedIndex = index;
      }

    });

    //A document was deleted
    if (change.deleted) {
      this.data.splice(changedIndex, 1);
    }
    else {

      //A document was updated
      if (changedDoc) {
        this.data[changedIndex] = change.doc;
      }

      //A document was added
      else {
        this.data.push(change.doc);
      }

    }

  }


  // getfHouse(): Promise<any> {
  //   return this.storage.get('fHouse');
  // }

  // save(data): void {

  //   let saveData = [];

  //   //Remove observables
  //   data.forEach((house) => {
  //     saveData.push({
  //       mls: house.mls,
  //       lat: house.lat,
  //       lng: house.lng
  //     });
  //   });

  //   let newData = JSON.stringify(saveData);
  //   this.storage.set('fHouse', newData);
  // }

  loginAlert() {
    let alert = this.alertc.create({
      title: '提示',
      subTitle: '请登录后使用此功能',
      buttons: ['确定']
    });
    alert.present();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  hasFavorite(mls, type) {
    return (this._favorites.indexOf(mls) > -1);
  }

  addFavorite(mls, type) {

    //check if user is logged in
    if (this.auth.authenticated()) {

      //check if mls# is in list
      if (this.hasFavorite) {
        //remove fav
        this.removeFavorite(mls, 1)
        this.presentToast("删除收藏(" + mls + ")成功!")
        return "D";
      } else {
        //add fav
        this._favorites.push(mls);
        console.log("Toaster Present");
        this.presentToast("添加收藏(" + mls + ")成功!")
        return "C";

      }


    } else {

      this.loginAlert();
      return "L";
    }




  }

  removeFavorite(mls, type) {
    let index = this._favorites.indexOf(mls)
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
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
