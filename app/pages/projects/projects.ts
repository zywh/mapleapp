import {Page, NavController, NavParams} from 'ionic-angular';
import {OnInit} from 'angular2/core';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';
import {ProjectDetailPage} from '../project-detail/project-detail';

//projects: Object;


//let projects = {};
@Page({
    templateUrl: 'build/pages/projects/projects.html'
})
export class ProjectsPage implements OnInit {
    //private nav;
    private parms = {};
    projects: Object;

    static get parameters() {
        return [[NavController], [MapleRestData],[MapleConf]];
    }

    constructor(private nav: NavController, private mapleRestData: MapleRestData,private mapleconf: MapleConf) {
        //this.nav = nav;
    }
    
    private swiperOptions = {
        loop: true,
        //pager: true,
        speed: 4000,
        autoplay: 300
    };

    ngOnInit() {
        this.getResult('index.php?r=ngget/getProjects');
        console.log("Page projects: picURL" + this.mapleconf.data.picHost);
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