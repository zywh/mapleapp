
import {Storage} from '@ionic/storage';
import {JwtHelper, tokenNotExpired} from 'angular2-jwt';
import {Injectable, NgZone} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {CN} from './cn';

// Avoid name not found warnings
declare var Auth0: any;
declare var Auth0Lock: any;

@Injectable()
export class AuthService {
  jwtHelper: JwtHelper = new JwtHelper();
  auth0 = new Auth0({ clientID: '9fNpEj70wvf86dv5DeXPijTnkLVX5QZi', domain: 'mapleapp.auth0.com' });
  options = {
    theme: {
      logo: "http://www.maplecity.com.cn/themes/house/images/layout/logo.jpg",
      primaryColor: "#FF5722"
    },
   languageDictionary: CN,
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

  constructor(zone: NgZone, public storage: Storage) {
    this.zoneImpl = zone;
    // Check if there is a profile saved in local storage
    this.storage.get('profile').then(profile => {
      this.user = JSON.parse(profile);
    }).catch(error => {
      console.log(error);
    });

    this.lock.on('authenticated', authResult => {
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
    });

  }

  public authenticated() {
    // Check if there's an unexpired JWT
    return tokenNotExpired();
  }

  public login() {
    // Show the Auth0 Lock widget
    this.lock.show();
  }

  public logout() {
    this.storage.remove('profile');
    this.storage.remove('id_token');
    this.storage.remove('refresh_token');
    this.zoneImpl.run(() => this.user = null);
  }
  
}