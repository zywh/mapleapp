import {Injectable} from '@angular/core';
import {Storage, LocalStorage, Events, SqlStorage} from 'ionic-angular';
import * as PouchDB from 'pouchdb';
//declare var PouchDB: any;


@Injectable()
export class UserData {
  _favorites = [];
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
  constructor(private events: Events) {
    this.storage = new Storage(SqlStorage, { name: 'maplecity' });

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
  getDocuments(): Promise<any> {

    return new Promise(resolve => {

      this.db.allDocs({

        include_docs: true,
        limit: 30,
        descending: true

      }).then((result) => {

        this.data = [];
        console.log(result)

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
