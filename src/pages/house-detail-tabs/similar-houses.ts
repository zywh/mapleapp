import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { houseModel } from '../../models/houseModel';
import { houseListModel } from '../../models/houseListModel';
import { MapleRestData } from '../../providers/maple-rest-data/maple-rest-data';
import { MapleConf } from '../../providers/maple-rest-data/maple-config';
//import { UserData } from '../../providers/user-data';
import { AuthService } from '../../providers/auth/auth';

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
  public similarHouseList;
  public houseM = new houseModel;
  private houseRestURL;

  constructor(
    public nav: NavController,
    private navParms: NavParams,
    private mapleRestData: MapleRestData,
    public auth: AuthService,
    public mapleConf: MapleConf
  ) {
    

  }


  ionViewWillEnter() {
    this.mapleConf.load().then(data => { 
      this.houseM = this.navParms.data.houseM;
      this.houseRestURL = data['mapHouseRest'];
      this.similar();
    })
   


  }



  similar() {

    let range: number = 0.1;


    let swLat = this.houseM.house.latitude - range;
    let swLng = this.houseM.house.longitude - range;
    let neLat = this.houseM.house.latitude + range;
    let neLng = this.houseM.house.longitude + range;
    let bounds = swLat + "," + swLng + "," + neLat + "," + neLng;
    let housePrice = { lower: this.houseM.house.lp_dol * 0.8 / 10000, upper: this.houseM.house.lp_dol * 1.2 / 10000 };
    //let houseArea;
    if (this.houseM.house.house_area > 100) {
      //houseArea = { lower: this.houseM.house.house_area * 0.8, upper: this.houseM.house.house_area * 1.2 };
    }


    //let landArea = {};
    if (this.houseM.house.land_area > 1000) {
      //landArea = { lower: this.houseM.house.land_area * 0.8, upper: this.houseM.house.land_area * 1.2 };
    }



    let mapParms = {
      bounds: bounds,
      housetype: [this.houseM.house.propertyType_id],
      sr: this.houseM.house.s_r,
      houseprice: housePrice,
      //houseroom: this.houseM.house.br,
      //housearea: houseArea,
      //houseground: landArea
      type: 'nearby',
      //housebaths: this.houseM.house.bath_tot
    }

    // this.mapleRestData.load(this.houseRestURL, mapParms).subscribe(
    this.mapleRestData.load(this.houseRestURL, mapParms).subscribe(
      data => {
      

        if (data.Data.Type == 'house') {
       
          this.similarHouseList = new houseListModel(data.Data.HouseList, this.auth.authenticated());
          //console.log(similarHouses);
          //this.nav.push(HouselistSearch, { list: similarHouses, imgHost: '', listType: 'house' });

          //this.currentMLS = this.houseM.house.ml_num;

        }
      })


  }
}
