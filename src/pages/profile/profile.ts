
import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth';
import { AboutPage } from '../about/about';
import { FavoritePage } from '../favorite/favorite';
import { HelpPage } from '../help/help';
import { MyCenterPage } from '../my-center/my-center'
import { UserData } from '../../providers/user-data';
import { SelectOptionModal } from '../../components/maple-map-search/map-option-modal';
import { SchoolSelectOptionModal } from '../school-map/schoolmap-option-modal';
import { MapleConf } from '../../providers/maple-rest-data/maple-config';


@Component({
  templateUrl: 'profile.html',
})
export class ProfilePage {

  public selectOptions;
  public count;
  public notificationFlag: boolean = false;
  public viewFlag: boolean = true;

  // We need to inject AuthService so that we can
  // use it in the view
  constructor(
    public auth: AuthService,
    private nav: NavController,
    private modalc: ModalController,
    private userData: UserData,
    public mapleConf: MapleConf
  ) {

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
  changeEmailFlag($e) {
    //console.log($e);
    //console.log(this.notificationFlag);
    let flag = (this.notificationFlag == true) ? 1 : 0;
    this.userData.saveSelectOption(flag, 'mailFlag');
  }
  changeViewFlag() {

    this.userData.viewType = this.viewFlag;
    console.log(this.userData.viewType);
    let flag = (this.viewFlag == true) ? 0 : 1;
    this.userData.saveSelectOption(flag, 'viewFlag');
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
      let modal = this.modalc.create(optionPage, { data: this.selectOptions, searchflag: false });
      modal.onDidDismiss(data => {

      });

      modal.present();

    })


  }

  myCenter(type) {
    this.nav.push(MyCenterPage, { type: type });
  }

  getCount() {

  }

  ionViewWillEnter() {
    console.log("profile page will enter");
    //get count
    this.userData.getFavCount().then(res => {
      this.count = res;
      this.notificationFlag = (this.count.mailFlag == 1) ? true : false;
      this.viewFlag = (this.count.viewFlag == 1) ? false : true;  // 1 or grid and 0 for list
    });




  }




}