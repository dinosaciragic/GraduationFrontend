import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Constants } from '../shared/constants';
import { HttpClient } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { map } from 'rxjs/operators';

const TOKEN_KEY = "tokenkey";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authenticationState = new BehaviorSubject(false);
  private url: string = Constants.API_URL + "user/";

  constructor(
    private storage: NativeStorage,
    private plt: Platform,
    private http: HttpClient
  ) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  async login(loginData: any): Promise<any> {
    let loginPromise = new Promise<any>((resolve, reject) => {
      this.http.post(this.url + 'login', loginData).subscribe((data) => {
        resolve(data);
      }, (error) => {
        reject("HTTP error");
      });
    });
    let login: any = await loginPromise;

    if (login.token) {
      return this.storage.setItem(TOKEN_KEY, login.token).then(res => {
        this.authenticationState.next(true);
      });
    } else {
      return login;
    }
  }

  logout() {
    return this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  getJWT(): Promise<any> {
    return this.storage.getItem(TOKEN_KEY).then(jwtLocal => {
      return jwtLocal;
    },
      error => {
        return {};
      }
    );
  }

  checkToken() {
    return this.storage.getItem(TOKEN_KEY).then(res => {
      if (res) {
        this.authenticationState.next(true);
      }
    });
  }

  async getCurrentUser(): Promise<any> {
    let jwt = await this.getJWTDecoded();
    let data = {
      id: jwt._id
    }

    let getUserPromise = new Promise<any>((resolve, reject) => {
      this.http.post(this.url + '/single', data).subscribe((data) => {
        resolve(data);
      }, (error) => {
        reject("HTTP error");
      });
    });

    let user: any = await getUserPromise;
    return user;
  }

  async register(registerData: any): Promise<any> {
    let registerPromise = new Promise<any>((resolve, reject) => {
      this.http.post(this.url + 'register', registerData).subscribe((data) => {
        resolve(data);
      }, (error) => {
        reject("HTTP error");
      });
    });
    let register: any = await registerPromise;
    return register;
  }

  async getJWTDecoded(): Promise<any> {
    let jwtDecodePromise = new Promise<any>((resolve, reject) => {
      this.storage.getItem(TOKEN_KEY).then(jwtLocal => {
        resolve(jwt_decode(jwtLocal));
      },
        error => {
          console.error("error on decode jwt in person provider -- getJWTdecoded: ", error);
          reject(error);
        }
      );
    });
    let jwtDecoded = await jwtDecodePromise;
    return jwtDecoded;
  }

}
