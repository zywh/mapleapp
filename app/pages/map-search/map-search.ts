import {Page, NavController} from 'ionic-angular';
import {ConferenceData} from '../../providers/conference-data';


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
  constructor(private confData: ConferenceData) {
    this.searchQuery = '';
    //this.initializeItems();
    this.items = [];
  }

  onPageLoaded() {
    this.confData.getMap().then(mapData => {
      let mapEle = document.getElementById('map');

      let map = new google.maps.Map(mapEle, {
        center: mapData.find(d => d.center),
        zoom: 16
      });

      mapData.forEach(markerData => {
        let infoWindow = new google.maps.InfoWindow({
          content: `<h5>${markerData.name}</h5>`
        });

        let marker = new google.maps.Marker({
          position: markerData,
          map: map,
          title: markerData.name
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });

      google.maps.event.addListenerOnce(map, 'idle', () => {
        mapEle.classList.add('show-map');
      });

    });
  }


  getItems(searchbar) {
    // Reset items back to all of the items
    this.items = [];

    // set q to the value of the searchbar
    var q = searchbar.value;

    // if the value is an empty string don't filter the items
    if (q.trim() == '') {
      return;
    } else {
      //Call REST
      this.items = ["1", "2", "fdasfasf"];
    }
  }

}
