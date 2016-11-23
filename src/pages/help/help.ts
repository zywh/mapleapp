import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
import {UserData} from '../../providers/user-data';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
/*
  Generated class for the HelpPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'help.html',
})
export class HelpPage {

  public data;
  public emailURL;
  public faqs;

  constructor(
    private mapleConf: MapleConf, 
    private userData: UserData, 
    private mapleRestData: MapleRestData,
    private alertc: AlertController
    ) {
    this.mapleConf.load().then(res => {
      this.data = res;
      this.emailURL = "mailto:" + this.data.feedbackEmail + "?Subject=枫之都应用反馈及意见";

    });
  }

 // ionViewWillEnter() {
 ionViewDidEnter() {
    console.log("Help View is entered" + this.data.helpRest);
    this.mapleRestData.load(this.data.helpRest, { type: 'faqs' }).subscribe(
      res => { this.faqs = res; console.log(res); }
    );

  }

  faqPopup(id){
    console.log(id);
     let faq = this.faqs.filter(function (obj) {
        return obj.id == id;
      });
      console.log(faq);
     let alert = this.alertc.create({
      title: faq[0].subject,
      subTitle: faq[0].text,
      buttons: ['关闭']
    });
    alert.present();
  }

}
