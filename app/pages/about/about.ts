import {Page, NavController, NavParams, Platform} from 'ionic-angular';
import {OnInit} from 'angular2/core';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {Post} from './post';
//import {MAPLECONF} from '../../providers/maple-rest-data/maple-config';

@Page({
  templateUrl: 'build/pages/about/about.html',
 
})
export class AboutPage implements OnInit {
 
  private section: string = "about";
  private isAndroid: boolean = false;
  // private postAbout = {
  //   id: '',
  //   title: ''
  //  };
  private postAbout: Object;
 // private postAbout: Post;

  static get parameters() {
    return [[MapleRestData]];
  }

  constructor(private mapleRestData: MapleRestData) {
   
  }


  ngOnInit() {
    this.getResult('index.php?r=ngget/getAbout');
  }

  getResult(url) {
    this.mapleRestData.load(url, { id: 27 }).subscribe(
      data => { this.postAbout = data; console.log("About Page Title:" + this.postAbout.title) }
    );
    // this.mapleRestData.load(url, {id: 28}).subscribe(
    //   data => this.postAdvantage = data
    // );
    // this.mapleRestData.load(url, {id: 30}).subscribe(
    //     data => this.postContact = data
    // );
    // this.mapleRestData.load(url, {id: 31}).subscribe(
    //    data => this.postHire = data
    // );
  }





}