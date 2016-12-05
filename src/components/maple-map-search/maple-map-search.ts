import { Component, ViewChild, ElementRef, Input } from '@angular/core';

declare var google: any;

/*
  Generated class for the MapleMapSearch component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'maple-map-search',
  templateUrl: 'maple-map-search.html'
})
export class MapleMapSearchComponent {
   @ViewChild('maplemapsearch') mapElement: ElementRef;
   @Input() center;



  constructor() {
    console.log('Hello MapleMapSearch Component');
    
  }
  ngOnChanges(changes) {
   

    if (this.center){
       this.initMap();
    
     }
    
  }
  
  

  initMap() {

    console.log(this.center);
    let point = new google.maps.LatLng(this.center['lat'], this.center['lng']);
    let mapOptions = {
      //center: latLng,
      center: point,
      minZoom: 4,
      zoom: 14,
      //draggable: false,
      //scrollwheel: false,
      // navigationControl: false,
      // mapTypeControl: false,
      // scaleControl: false,
      //draggable: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    let map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    new google.maps.Marker({
      position: point,
      map: map,
      animation: google.maps.Animation.DROP,
      draggable: false,
    });


  }




}
