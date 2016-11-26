import {NavParams} from 'ionic-angular';
import {OnInit, Component} from '@angular/core';
import {MapleRestData} from '../../providers/maple-rest-data/maple-rest-data';
import {MapleConf} from '../../providers/maple-rest-data/maple-config';

export interface Post {
  id: number;
  title?: String;
  content?: String;
  image?: String;


}
@Component({
  templateUrl: 'post.html'
})
export class PostPage implements OnInit {
  public postRest;
  public postpicHost;
  public postId;
  public post: Post;
  public nextPost: Number;
  public prePost: Number;
  public preButton: Boolean = true;
  public nextButton: Boolean = true;


  static get parameters() {
    return [[MapleRestData], [MapleConf],[NavParams]];
  }

  constructor(
    private mapleRestData: MapleRestData,
    private mapleconf: MapleConf,
    private navParms: NavParams
  ) {
    this.postId = navParms.data;
   
  }


  ngOnInit() {

    this.mapleconf.load().then(data => {
   
      this.postRest = data.postRest;
      this.postpicHost = data.postpicHost;
      this.getResult(this.postRest, this.postId);
    })

  }

  getResult(url, id) {
    this.mapleRestData.load(url, { id: id }).subscribe(
      data => {
        this.post = data.current;
        let next = data.next;
        if (next.id != null) {
          this.nextPost = next.id;
          this.nextButton = true

        } else {
          this.nextButton = false;
        }
        let pre = data.pre;
        //if (pre.hasOwnProperty("id")) {
        if (pre.id != null) {
          this.prePost = pre.id;
          this.preButton = true;

        } else {
          this.preButton = false;
        }

        console.log(this.post);

      }
    );

  }

  go2PrePost() {
    console.log("Prepost" + this.prePost);
    this.getResult(this.postRest, this.prePost);
  }

  go2NextPost() {
    console.log("Nextpost" + this.nextPost);
    this.getResult(this.postRest, this.nextPost)
  }
  
}