
import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AuthService} from '../../providers/auth/auth';
import {AboutPage} from '../about/about';

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

  }
  aboutUs(){
    this.nav.push(AboutPage);
  }

  help(){
    
  }
  favorite(){

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