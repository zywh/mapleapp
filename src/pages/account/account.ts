import {Page, NavController, AlertController} from 'ionic-angular';
import {UserData} from '../../providers/user-data';
import {LoginPage} from '../login/login';

@Page({
  templateUrl: 'build/pages/account/account.html',
})
export class AccountPage {
  username: string;

  constructor(private nav: NavController, private userData: UserData,private alertc: AlertController) {

  }

  ngAfterViewInit() {
    this.getUsername();
  }

  updatePicture() {
    console.log("Clicked to update picture");
  }

  // Present an alert with the current username populated
  // clicking OK will update the username and display it
  // clicking Cancel will close the alert and do nothing
  changeUsername() {
    let alert = this.alertc.create({
      title: "Change Username",
      buttons: [
        "Cancel"
      ]
    });
    alert.addInput({
      name: 'username',
      value: this.username,
      placeholder: 'username'
    });
    alert.addButton({
      text: 'Ok',
      handler: data => {
        this.userData.setUsername(data.username);
        this.getUsername();
      }
    });

    alert.present();
  }

  getUsername() {
    this.userData.getUsername().then((username) => {
      this.username = username;
    });
  }

  changePassword() {
    console.log("Clicked to change password");
  }

  logout() {
    this.userData.logout();
    this.nav.setRoot(LoginPage);
  }
}
