import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
//import { Deploy } from '@ionic/cloud-angular';

/*
  Generated class for the Update provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UpdateService {

  constructor(
      //public deploy: Deploy,
      private alertc: AlertController) {
  }

  newUpdateAlert() {
    let alert = this.alertc.create({
      title: '软件更新可用',
      message: '新版本已下载，重启应用？',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('newUpdateAlert Cancel clicked');
          }
        },
        {
          text: '重启应用',
          handler: () => {
            alert.dismiss().then(res => {
              //this.deploy.load();
            })
          }
        }
      ]
    });
    alert.present();
  }


  newUpdate() {
    // this.deploy.check().then((snapshotAvailable: boolean) => {
    //     if (snapshotAvailable) {
    //       this.deploy.download().then(() => {
    //         this.deploy.extract().then(() => {
    //           this.newUpdateAlert();
    //         });
    //       });
    //     }
    //   });
 }
}

