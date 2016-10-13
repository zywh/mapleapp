
import { NavController,NavParams} from 'ionic-angular';
import {Component} from '@angular/core';
import {UserData} from './user-data';
declare var Wechat: any;

@Component({
  template: `
    <ion-list>
     <ion-item (click)="userData.shareWechat(0,link,img,title,des)">
      <ion-icon color='primary' name="share-alt" item-left></ion-icon>
      发送给朋友
  
     </ion-item>
       <ion-item (click)="userData.shareWechat(1,link,img,title,des)">
    <ion-icon color='primary' name="refresh-circle" item-left></ion-icon>
     分享到朋友圈
      </ion-item>
   <ion-item (click)="userData.shareWechat(2,link,img,title,des)">
      <ion-icon color='primary' name="bookmark" item-left></ion-icon>
      收藏
  
     </ion-item>

    </ion-list>
  `
})


export class SharePage {
  public link;
  public img;
  public title;
  public des;

  constructor(private navParams: NavParams, public userData: UserData) {

  }

 ngOnInit() {
  
     // this.link = this.navParams.data.link;
      // this.img = this.navParams.data.img;
      // this.title = this.navParams.data.title;
      // this.des; this.navParams.data.des;
      // console.log("SHARE:" +this.link );
      // console.log("SHARE:" +this.img );
      // console.log("SHARE:"  + this.title );
      // console.log("SHARE:"  + this.des);
  
    
  }


  
  shareWechat(type,link,img,title,des) {

    //  Scene: {
    //     SESSION:  0, // 聊天界面
    //     TIMELINE: 1, // 朋友圈
    //     FAVORITE: 2  // 收藏
    // },
    console.log("TYPE" + type );
    
    Wechat.share({
      message: {
        title: title,
        description: this.des,
        thumb: this.img,
        media: {
          type: Wechat.Type.LINK,   // webpage
          webpageUrl: this.link    // webpage
        }
      },
      //scene: Wechat.Scene[type]   // share to Timeline
      scene: type
      
    }, function () {
      alert("success");
    }, function (reason) {
      alert("Failed: " + Wechat.Scene[type]);
    });




  }

}