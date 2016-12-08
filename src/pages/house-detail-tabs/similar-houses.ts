import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the SimilarHouses page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-similar-houses',
  templateUrl: 'similar-houses.html'
})
export class SimilarHousesPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello SimilarHousesPage Page');
  }

}
