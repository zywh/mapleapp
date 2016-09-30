import {NavController} from 'ionic-angular';
import {Component} from '@angular/core';
import {TabsPage} from '../tabs/tabs';
import {UserData} from '../../providers/user-data';


@Component({
  templateUrl: 'signup.html'
})
export class SignupPage {
  signup: {username?: string, password?: string} = {};
  submitted = false;

  constructor(private nav: NavController, private userData: UserData) {}

  onSignup(form) {
    this.submitted = true;

    if (form.valid) {
      this.userData.signup(this.signup.username);
      this.nav.push(TabsPage);
    }
  }
}
