
import {Component} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';
import {AuthService} from '../../providers/auth/auth';
import {AboutPage} from '../about/about';
import {FavoritePage} from '../favorite/favorite';
import {HelpPage} from '../help/help';
import {MyCenterPage} from '../my-center/my-center'
import {UserData} from '../../providers/user-data';
import {SelectOptionModal} from '../map-search/map-option-modal';
import {SchoolSelectOptionModal} from '../school-map/schoolmap-option-modal';

@Component({
  templateUrl: 'profile.html',
})
export class ProfilePage {

  public selectOptions;
  public count;

  // We need to inject AuthService so that we can
  // use it in the view
  constructor(
    private auth: AuthService,
    private nav: NavController,
    private modalc: ModalController,
    private userData: UserData
  ) {
    console.log(auth.user);
  }
  aboutUs() {
    this.nav.push(AboutPage);
  }

  help() {
     this.nav.push(HelpPage);
  }
  favorite(type) {
    this.nav.push(FavoritePage, { type: type });

  }

  searchDefault(type) {
    let optionPage: any;
    let optionName;


    if (type == 0) {
      //init house page parm
      this.selectOptions = {
        selectSR: true,
        selectBaths: 0,
        selectBeds: 0,
        selectHousesize: { lower: 0, upper: 4000 },
        selectLandsize: { lower: 0, upper: 43560 },
        selectPrice: { lower: 0, upper: 600 },
        selectType: '',
        selectListType: true,
        selectDate: 0

      }
      optionPage = SelectOptionModal;
      optionName = 'houseSearch';
    } else {
      //init school map parm
      this.selectOptions = {
        selectPingfen: 0,
        selectRank: 0,
        selectType: false,
        selectXingzhi: ''

      }
      optionPage = SchoolSelectOptionModal;
      optionName = 'schoolSearch';
    }

    this.userData.getUserSelections(optionName).then(res => {
      if (res != null) { this.selectOptions = res; }
      let modal = this.modalc.create(optionPage, { data: this.selectOptions });
      modal.onDidDismiss(data => {
        console.log("Default selection is closed")
      });

      modal.present();

    })


  }

  myCenter(type) {
    this.nav.push(MyCenterPage, {type: type});
  }

  ionViewWillEnter() {
    console.log("profile page will enter");
    //get count
    this.userData.getFavCount().then(res => {
      this.count = res;
    });




  }




}