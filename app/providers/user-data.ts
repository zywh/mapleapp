import {Injectable} from '@angular/core';
import {Storage, LocalStorage, Events,SqlStorage} from 'ionic-angular';


@Injectable()
export class UserData {
  _favorites = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  storage: Storage;
  constructor(private events: Events) {
     this.storage = new Storage(SqlStorage, {name:'maplecity'});
  }
  getfHouse(): Promise<any> {
    return this.storage.get('fHouse');  
  }

  save(data): void {

    let saveData = [];

    //Remove observables
    data.forEach((house) => {
      saveData.push({
        mls: house.mls,
        lat: house.lat,
        lng: house.lng
      });
    });

    let newData = JSON.stringify(saveData);
    this.storage.set('fHouse', newData);
  }

  hasFavorite(sessionName) {
    return (this._favorites.indexOf(sessionName) > -1);
  }

  addFavorite(sessionName) {
    this._favorites.push(sessionName);
  }

  removeFavorite(sessionName) {
    let index = this._favorites.indexOf(sessionName)
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
