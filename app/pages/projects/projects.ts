import {Page, NavController, NavParams} from 'ionic-angular';
import {OnInit} from 'angular2/core';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {MAPLECONF} from '../../providers/maple-rest-data/maple-config';
import {ProjectDetailPage} from '../project-detail/project-detail';

//projects: Object;


//let projects = {};
@Page({
    templateUrl: 'build/pages/projects/projects.html'
})
export class ProjectsPage implements OnInit {
    private nav;
    //public MapleRestData;
    private parms = {};

    //projects = {name: "Projectname", summary: "fsdfdsfsdfsdfsfsd"};
    projects: Object;

    static get parameters() {
        return [[NavController], [NavParams], [MapleRestData]];
    }

    constructor(nav, navParams, private mapleRestData: MapleRestData) {
        this.nav = nav;
        //this.MapleRestData = MapleRestData;
        //this.parms = navParams.get('id');
        //this.parms = { id: "8", type: "rent" };
        //this.projects = projects;

    }
    swiperOptions = {
        loop: true,
        //pager: true,
        speed: 4000,
        autoplay: 300
    };

    ngOnInit() {
        this.getResult('index.php?r=ngget/getProjects');
    }

    getResult(url) {
        this.mapleRestData.load(url, this.parms).subscribe(
            data => { this.projects = data; console.log(this.projects); }
        );
    }

    goToProject(id) {
        this.nav.push(ProjectDetailPage, id);
    }



}