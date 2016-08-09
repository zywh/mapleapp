
import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AuthService} from '../../providers/auth/auth';
import {AboutPage} from '../about/about';
import {FavoritePage} from '../favorite/favorite'

@Component({
  templateUrl: 'build/pages/profile/profile.html',
})
export class ProfilePage {
  
  // We need to inject AuthService so that we can
  // use it in the view
  constructor(
    private auth: AuthService,
    private nav: NavController
  ) {
    console.log(auth.user);
  }
  aboutUs(){
    this.nav.push(AboutPage);
  }

  help(){
    
  }
  favorite(){
    this.nav.push(FavoritePage);
    
  }
  route(){

  }
  houseSearchDefault(){

  }
  schoolSearchDefault(){

  }

  centerDefault(){

  }

}