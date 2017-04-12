
import { Storage } from '@ionic/storage';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Rx';
//import { CN } from './cn';
import { Events } from 'ionic-angular';

// Avoid name not found warnings
declare var Auth0: any;
declare var Auth0Lock: any;

@Injectable()
export class AuthService {
  jwtHelper: JwtHelper = new JwtHelper();
  auth0 = new Auth0({ clientID: '9fNpEj70wvf86dv5DeXPijTnkLVX5QZi', domain: 'mapleapp.auth0.com' });
  options = {
    //redirect: false,
    //autoclose: true,
    //popupOptions: { width: 30, height: 40, left: 200, top: 300 },
    theme: {
      labeledSubmitButton: false,
      logo: "http://www.maplecity.com.cn/themes/house/images/layout/logo.jpg",
      primaryColor: "#FF5722"
    },
    //languageDictionary: CN,
    languageDictionary: {

      title: "枫之都"
    },
    language: 'zh',
    //sso: false,
    rememberLastLogin: false,

    auth: {
      redirect: false,
      params: {
        scope: 'openid offline_access',
      }
    }
  }
  lock = new Auth0Lock('9fNpEj70wvf86dv5DeXPijTnkLVX5QZi', 'mapleapp.auth0.com', this.options);
  refreshSubscription: any;
  user: Object;
  zoneImpl: NgZone;
  storage: Storage = new Storage();
  //storage: Storage;
  idToken: string;

  constructor(zone: NgZone, private events: Events) {
    this.zoneImpl = zone;
    // Check if there is a profile saved in local storage
    this.storage.get('profile').then(profile => {
      this.user = JSON.parse(profile);
    }).catch(error => {
      console.log(error);
    });


    this.storage.get('id_token').then(token => {
      this.idToken = token;
    });

    this.lock.on('authenticated', authResult => {
      this.storage.remove('profile');
      this.storage.remove('id_token');
      this.idToken = authResult.idToken;
      // local save for authhttp use by maple-rest-data - default token name is id_token
      this.storage.set('id_token', authResult.idToken);
      localStorage.setItem('id_token', authResult.idToken);

      // Fetch profile information
      this.lock.getProfile(authResult.idToken, (error, profile) => {
        if (error) {
          // Handle error
          alert(error);
          return;
        }

        profile.user_metadata = profile.user_metadata || {};
        this.storage.set('profile', JSON.stringify(profile));
        this.user = profile;
      });

      this.lock.hide();

      this.storage.set('refresh_token', authResult.refreshToken);
      this.zoneImpl.run(() => this.user = authResult.profile);
      this.events.publish('user:login');
    });

  }

  public authenticated() {
    // Check if there's an unexpired JWT
    // return tokenNotExpired();
    return tokenNotExpired('id_token', this.idToken);
  }

  public login() {
    // Show the Auth0 Lock widget
    this.lock.show();
  }

  public logout() {
    this.storage.remove('profile');
    this.storage.remove('id_token');
    this.idToken = null;
    localStorage.removeItem('id_token');
    this.storage.remove('refresh_token');
    this.zoneImpl.run(() => this.user = null);
    this.events.publish('user:logout');
    this.unscheduleRefresh();

  }

  public scheduleRefresh() {
    // If the user is authenticated, use the token stream
    // provided by angular2-jwt and flatMap the token

    let source = Observable.of(this.idToken).flatMap(
      token => {
      
        let jwtIat = this.jwtHelper.decodeToken(token).iat;
        let jwtExp = this.jwtHelper.decodeToken(token).exp;
        let iat = new Date(0);
        let exp = new Date(0);

        let delay = (exp.setUTCSeconds(jwtExp) - iat.setUTCSeconds(jwtIat));

        return Observable.interval(delay);
      });

    this.refreshSubscription = source.subscribe(() => {
      this.getNewJwt();
    });
  }

  public startupTokenRefresh() {
    // If the user is authenticated, use the token stream
    // provided by angular2-jwt and flatMap the token
    if (this.authenticated()) {
      let source = Observable.of(this.idToken).flatMap(
        token => {
          // Get the expiry time to generate
          // a delay in milliseconds
          let now: number = new Date().valueOf();
          let jwtExp: number = this.jwtHelper.decodeToken(token).exp;
          let exp: Date = new Date(0);
          exp.setUTCSeconds(jwtExp);
          let delay: number = exp.valueOf() - now;

          // Use the delay in a timer to
          // run the refresh at the proper time
          return Observable.timer(delay);
        });

      // Once the delay time from above is
      // reached, get a new JWT and schedule
      // additional refreshes
      source.subscribe(() => {
        this.getNewJwt();
        this.scheduleRefresh();
      });
    }
  }

  public unscheduleRefresh() {
    // Unsubscribe fromt the refresh
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  public getNewJwt() {
    // Get a new JWT from Auth0 using the refresh token saved
    // in local storage
    this.storage.get('refresh_token').then(token => {
      this.auth0.refreshToken(token, (err, delegationRequest) => {
        if (err) {
          alert(err);
        }
        this.storage.set('id_token', delegationRequest.id_token);
        this.idToken = delegationRequest.id_token;
      });
    }).catch(error => {
      console.log(error);
    });

  }

}