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
  constructor(private confData: ConferenceData) {}

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
}
