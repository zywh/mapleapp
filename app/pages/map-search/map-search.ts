import {Page, NavController} from 'ionic-angular';

/*
  Generated class for the MapSearchPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/map-search/map-search.html',
})
export class MapSearchPage {
  private searchQuery: String;
  private items: Array<String>;
  constructor(public nav: NavController) {
    this.searchQuery = '';
    //this.initializeItems();
    this.items = [];
  }
  getItems(searchbar) {
    // Reset items back to all of the items
    this.items = [];

    // set q to the value of the searchbar
    var q = searchbar.value;

    // if the value is an empty string don't filter the items
    if (q.trim() == '') {
      return;
    }else{
      //Call REST
       this.items = ["1","2","fdasfasf"];
    }
  }
}
