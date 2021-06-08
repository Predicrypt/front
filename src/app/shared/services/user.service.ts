import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../config/constants';
import { Balance } from '../interfaces/BalanceData';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getBalances() {
    const url = `${Constants.urls.base}${Constants.urls.users}${Constants.urls.balances}`;

    return this.http.get<Balance[]>(url, {
      observe: 'response',
    });
  }

  saveKeys(apiKey: string, secretKey: string) {
    const url = `${Constants.urls.base}${
      Constants.urls.users
    }/${this.authService.getUserId()}${Constants.urls.keys}`;

    return this.http.post<any>(
      url,
      { apiKey, secretKey },
      {
        observe: 'response',
      }
    );
  }
}
