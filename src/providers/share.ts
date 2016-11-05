import { Injectable } from '@angular/core';
import { Platform, PopoverController } from 'ionic-angular';
import { SocialSharing } from 'ionic-native';
import 'rxjs/add/operator/map';
declare var Wechat: any;

/*
  Generated class for the Share provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ShareService {

  constructor(private platform: Platform,
    public popoverCtrl: PopoverController) {
  }

  share(link, img, title, des) {
    //console.log(link + "," + img +","+title +":" + des);
    let type = 0;
    if (this.platform.is('android')) {
    
   this.shareWechat(type,link, img, title, des);
     
   //let popover = this.popoverCtrl.create(SharePage,{link:link,img:img,title:title,des:des});

   // popover.present();

    } else {
      this.shareSocial(link, img, title, des);
      //this.shareWechat(type,link, img, title, des);
     
    }
  }

  shareWechat(type,link,img,title,des) {

    //  Scene: {
    //     SESSION:  0, // 聊天界面
    //     TIMELINE: 1, // 朋友圈
    //     FAVORITE: 2  // 收藏
    // },
    
    Wechat.share({
      message: {
        title: title,
        description: des,
        thumb: img,
        media: {
          type: Wechat.Type.LINK,   // webpage
          webpageUrl: link    // webpage
        }
      },
     // scene: Wechat.Scene.SESSION   // share to Timeline
     scene: type
    }, function () {
      //alert("success");
    }, function () {
      //alert("Failed");
    });
  }

  shareSocial(link, img, title, des) {

    var onSuccess = function (result) {
      console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
      console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
    }
    var options = {
      message: des, // not supported on some apps (Facebook, Instagram)
      subject: title, // fi. for email
      files: [img], // an array of filenames either locally or remotely
      url: link,
      chooserTitle: '分享' // Android only, you can override the default share sheet title
    }
    var onError = function (msg) {
      console.log("Sharing failed with message: " + msg);
    }
    SocialSharing.shareWithOptions(options);
  }
}
