
import {Component} from '@angular/core';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';

export interface Post {
  id: number;
  title: string;
  content: string;
  imgHost: string;
  catname: string;

}
@Component({
  templateUrl: 'about.html',
 
})
export class AboutPage  {
 
  public section: string = "about";
  public isAndroid: boolean = false;
  
  public postAbout: Post;
  public postAdvantage: Post;
  public postContact: Post;
  public postHire: Post;
  public imgHost;
 // public postAbout: Post;

  // static get parameters() {
  //   return [[MapleRestData],[MapleConf]];
  // }

  constructor(private mapleRestData: MapleRestData, private mapleconf: MapleConf) { }


  ngAfterViewInit(): void {
   
      this.mapleconf.load().then(data => {
    
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