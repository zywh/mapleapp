import { Component,Input } from '@angular/core';
import {UserData} from '../../providers/user-data';
import {HouseDetailPage} from '../../pages/house-detail/house-detail';
import { NavController, reorderArray } from 'ionic-angular';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';

@Component({
  selector: 'house-list',
  templateUrl: 'build/components/house-list/house-list.html'
})
export class HouseList {
  @Input() houselist: any;
  @Input() imgHost: String;
  constructor(
    private userData: UserData,
    private mapleConf: MapleConf,
    private nav: NavController
  ) {
   console.log("Houst List Component is called")
  }

gotoHouseDetail(mls) {
    this.nav.push(HouseDetailPage, { id: mls, list: this.houselist });
  }

}
