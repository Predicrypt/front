import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../config/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  getEmail() {
    return this.getPayload().email;
  }

  getUserId() {
    return this.getPayload().id;
  }

  getPayload() {
    let session = this.getCookie('express:sess');
    if (session) {
      let obj = JSON.parse(atob(session));
      if (obj) {
        try {
          return JSON.parse(atob(obj.jwt.split('.')[1]));
        } catch (err) {
          console.log(err);
          return null;
        }
      }
      return null;
    }
    return null;
  }

  isLogged(): boolean {
    return this.getPayload() !== null;
  }

  private getCookie(name: string) {
    let ca: Array<string> = document.cookie.split(';');
    let caLen: number = ca.length;
    let cookieName = `${name}=`;
    let c: string;

    for (let i: number = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, '');
      if (c.indexOf(cookieName) == 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return '';
  }

  login(email: string, password: string) {
    const url = `${Constants.urls.base}${Constants.urls.auth}${Constants.urls.login}`;

    return this.http.post(url, { email, password }, { observe: 'response' });
  }

  register(email: string, password: string, passwordConfirm: string) {
    const url = `${Constants.urls.base}${Constants.urls.auth}${Constants.urls.signUp}`;

    return this.http
      .post(url, { email, password, passwordConfirm }, { observe: 'response' });
  }

  logout() {
    const url = `${Constants.urls.base}${Constants.urls.auth}${Constants.urls.logout}`;

    this.http.get(url).subscribe(
      (res) => console.log,
      (err) => console.log
    );
  }
}
