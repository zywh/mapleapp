import { Component, ViewChild, ElementRef, Input } from '@angular/core';

declare var google: any;

@Component({
  selector: 'simple-map',
  templateUrl: 'simple-map.html'
})
export class SimpleMapComponent {
  @ViewChild('maphouse') mapElement: ElementRef;
  @Input() center;


  constructor() {

  }


  ngOnInit() {
    console.log("Init simple map component");
    this.initMap();
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
