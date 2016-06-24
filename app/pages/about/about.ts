import {Page, NavController, NavParams, Platform} from 'ionic-angular';
import {OnInit,Component} from '@angular/core';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';

interface Post {
  id: number;
  title: String;
  content: String;
  imgHost: String;
  catname: String;

}
@Component({
  templateUrl: 'build/pages/about/about.html',
 
})
export class AboutPage implements OnInit {
 
  private section: string = "about";
  private isAndroid: boolean = false;
  
  private postAbout: Post;
  private postAdvantage: Post;
  private postContact: Post;
  private postHire: Post;
  private imgHost;
 // private postAbout: Post;

  static get parameters() {
    return [[MapleRestData],[MapleConf]];
  }

  constructor(private mapleRestData: MapleRestData, private mapleconf: MapleConf) { }


  ngOnInit() {
    
      this.mapleconf.load().then(data => {
      console.log(data.projectRest);
      this.getResult(data.aboutRest);
      this.imgHost = data.postpicHost;
    })
    
    //this.getResult('index.php?r=ngget/getAbout');
  }

  getResult(url) {
    this.mapleRestData.load(url, { id: 27 }).subscribe(
      data => { 
        this.postAbout = data;
        //Change it before first tab is rendered
        this.postAbout.content = this.changeImgPath(this.postAbout.content);
        }
       
    );
    this.mapleRestData.load(url, {id: 28}).subscribe(
      data => this.postAdvantage = data
    );
    this.mapleRestData.load(url, {id: 30}).subscribe(
        data => this.postContact = data
    );
    this.mapleRestData.load(url, {id: 31}).subscribe(
       data => this.postHire = data
    );
  }

  changeImgPath(s){
    return s.replace(/\/uploads/g, this.imgHost + 'uploads');
  }





}