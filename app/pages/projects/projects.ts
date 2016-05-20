import {Page, NavController, NavParams} from 'ionic-angular';
import {OnInit} from 'angular2/core';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {MAPLECONF} from '../../providers/maple-rest-data/maple-config';

//projects: Object;
let url =  MAPLECONF.restHost +  'index.php?r=projects/getProjects';

//let projects = {};
@Page({
    templateUrl: 'build/pages/projects/projects.html'
})
export class ProjectsPage implements OnInit {
    private nav;
    //public MapleRestData;
    private parms = {};
    s1 = "Test dfsdafasdfasd";
    s2 = "Test2";
    //projects = {name: "Projectname", summary: "fsdfdsfsdfsdfsfsd"};
    projects: Object;

    static get parameters() {
        return [[NavController], [NavParams], [MapleRestData]];
    }

    constructor(nav, navParams, private mapleRestData: MapleRestData) {
        this.nav = nav;
        //this.MapleRestData = MapleRestData;
        //this.parms = navParams.get('id');
        this.parms = { id: "1", type: "rent" };
        //this.projects = projects;

    }


    ngOnInit() {
        this.getResult(url,this.parms);
        //this.getResult();
    }

    getResult(restURL, parms) {
    //getResult() {

        //let result: Object;
        //this.mapleRestData.load(url, this.parms).then(projects => this.projects = projects);
        //this.mapleRestData.projectStatic().then(projects => this.projects = projects);
         this.projects = {id: "1", name: "fsdfasdfas"};
        
        //return result;
    }





}