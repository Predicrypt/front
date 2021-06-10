import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../config/constants';
import { OrderSide } from '../enums/OrderSide';
import { OrderTypes } from '../enums/OrderTypes';
import { PriceChange24hr } from '../interfaces/Binance/24hrPriceChange';
import { AccountTradeListResponse } from '../interfaces/Binance/AccountTradeList';
import { AllOrdersRequest } from '../interfaces/Binance/AllOrders';
import { CandlestickDataRequest } from '../interfaces/Binance/CandlestickData';

@Injectable({
  providedIn: 'root',
})
export class BinanceService {
  private URL = 'https://api.binance.com';
  private URL_WEBSOCKET = 'wss://stream.binance.com:9443/ws';
  private websocketClient: WebSocket;
  private id = 1;

  constructor(private http: HttpClient) {}

  getWebsocketInstance(): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      this.websocketClient = new WebSocket(`${this.URL_WEBSOCKET}`);
      this.websocketClient.addEventListener('open', (ev) => {
        console.log('Connected');
        this.websocketClient.addEventListener('error', console.log);
        resolve(this.websocketClient);
      });
    });
  }

  subscribeToPairWebsocket(symbol: string, interval: string) {
    const req = {
      method: 'SUBSCRIBE',
      params: [`${symbol.toLowerCase()}@kline_${interval}`],
      id: this.id,
    };
    this.websocketClient.send(JSON.stringify(req));
    this.id++;
  }

  unsubscribefromPairWebsocket(symbol: string, interval: string) {
    const req = {
      method: 'UNSUBSCRIBE',
      params: [`${symbol}@kline_${interval}`],
      id: this.id,
    };

    this.websocketClient.send(JSON.stringify(req));
    this.id++;
  }

  subscribeToMultiplePairsWebsocket(
    paramsArr: { symbol: string; interval: string }[]
  ) {
    let params = [];
    for (let kline of paramsArr) {
      params.push(`${kline.symbol}@kline_${kline.interval}`);
    }

    const req = {
      method: 'SUBSCRIBE',
      params: params,
      id: this.id,
    };

    this.websocketClient.send(JSON.stringify(req));
    this.id++;
  }

  unsubscribeFromMultiplePairsWebsocket(
    paramsArr: { symbol: string; interval: string }[]
  ) {
    let params = [];
    for (let kline of paramsArr) {
      params.push(`${kline.symbol}@kline_${kline.interval}`);
    }

    const req = {
      method: 'UNSUBSCRIBE',
      params: params,
      id: this.id,
    };

    this.websocketClient.send(JSON.stringify(req));
    this.id++;
  }

  getKlinesData(obj: CandlestickDataRequest) {
    const url = `${this.URL}/api/v3/klines`;

    return this.http.get<any[][]>(url, {
      observe: 'response',
      params: obj as any,
    });
  }

  getTrades(symbol: string) {
    const url = `${Constants.urls.base}${Constants.urls.users}${Constants.urls.trades}`;

    return this.http.get<AccountTradeListResponse[]>(url, {
      observe: 'response',
      params: { symbol: symbol },
    });
  }

  postOrder(obj: {
    symbol: string;
    side: OrderSide;
    type: OrderTypes;
    quantity: number;
    price?: number;
  }) {
    const url = `${Constants.urls.base}${Constants.urls.orders}${Constants.urls.spot}`;

    return this.http.post<any>(url, obj, { observe: 'response' });
  }

  get24htAveragePrices() {
    const url = `${this.URL}/api/v3/ticker/24hr`;

    return this.http.get<PriceChange24hr[]>(url, { observe: 'response' });
  }

  get24htAveragePrice(symbol: string) {
    const url = `${this.URL}/api/v3/ticker/24hr?symbol=${symbol}`;

    return this.http.get<PriceChange24hr>(url, { observe: 'response' });
  }
}
