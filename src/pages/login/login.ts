 
import {Component} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';
import {AuthService} from '../../providers/auth/auth';
// import {AboutPage} from '../about/about';
// import {FavoritePage} from '../favorite/favorite';
// import {MyCenterPage} from '../my-center/my-center'
// import {UserData} from '../../providers/user-data';
// import {SelectOptionModal} from '../map-search/map-option-modal';
// import {SchoolSelectOptionModal} from '../school-map/schoolmap-option-modal';


@Component({
  templateUrl: 'login.html'
})
export class LoginPage {


  // We need to inject AuthService so that we can
  // use it in the view
  constructor(
    private auth: AuthService,
    private nav: NavController
   
  ) {}
 

  }

  


