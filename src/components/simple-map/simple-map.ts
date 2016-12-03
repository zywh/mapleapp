import { Component, ViewChild, ElementRef, Input } from '@angular/core';

declare var google: any;

@Component({
  selector: 'simple-map',
  templateUrl: 'simple-map.html'
})
export class SimpleMapComponent {
  @ViewChild('simplemap') mapElement: ElementRef;
  @Input() center;


  constructor() {

  }


  // ngOnInit() {
  //   console.log("Init simple map component");
  //   this.initMap();
  // }

 
  // ngOnDestroy() {
  //     console.log("ngOnDestroy");
  //   // Speak now or forever hold your peace
  // }
  // ngDoCheck() {
  //     console.log("ngDoCheck");
  //   // Custom change detection
  // }
  ngOnChanges(changes) {

     console.log("ngOnChanges");
     this.initMap();
    // Called right after our bindings have been checked but only
    // if one of our bindings has changed.
    //
    // changes is an object of the format:
    // {
    //   'prop': PropertyUpdate
    // }
  }
  // ngAfterContentInit() {

  //    console.log( "ngAfterContentInits");
  //   // Component content has been initialized
  // }
  // ngAfterContentChecked() {
  //    console.log("ngAfterContentChecked");
  //   // Component content has been Checked
  // }
  // ngAfterViewInit() {
  //    console.log("ngAfterViewInit");
  //   // Component views are initialized
  // }
  // ngAfterViewChecked() {
  //    console.log("ngAfterViewChecked");
  //   // Component views have been checked
  // }

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
