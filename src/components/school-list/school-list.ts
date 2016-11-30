import { Component, Input } from '@angular/core';
//import { UserData } from '../../providers/user-data';
import { Events } from 'ionic-angular';
//import { MapleConf } from '../../providers/maple-rest-data/maple-config';
//import { MapleRestData } from '../../providers/maple-rest-data/maple-rest-data';

/*
  Generated class for the SchoolList component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'school-list',
  templateUrl: 'school-list.html'
})
export class SchoolListComponent {

  @Input() schoolList;

  constructor(private events: Events) {

  }
  schoolClick(lat, lng) {

    this.events.publish('map:center', { type: 'SCHOOL', lat: lat, lng: lng }); //public event and trigger tab select and map change
  }



}
