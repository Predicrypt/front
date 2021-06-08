import {
  AfterContentInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
} from 'lightweight-charts';
import {
  CandlestickStream,
  CandlestickStreamData,
} from '../../interfaces/Binance/CandlestickStream';
import { KlineChartData } from '../../interfaces/Binance/KlineChartData';
import { BinanceService } from '../../services/binance.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit, AfterContentInit, OnDestroy {
  @Input() symbol: string;
  @Input() interval: string;

  chart: IChartApi;
  candleStickSeries: ISeriesApi<'Candlestick'>;
  ws: WebSocket;
  klines: KlineChartData[] = [];
  finish = false;

  constructor(private binanceService: BinanceService) {}

  ngOnInit(): void {}
  ngAfterContentInit() {
    this.chart = createChart('graph', { width: 1000, height: 600 });
    this.initChart();
  }

  ngOnDestroy(): void {
    if (this.symbol && this.interval) {
      this.binanceService.unsubscribefromPairWebsocket(
        this.symbol,
        this.interval
      );
    }
  }

  initChart() {
    if (this.symbol && this.interval) {
      this.binanceService
        .getKlinesData({
          symbol: this.symbol,
          interval: this.interval,
        })
        .subscribe(async (res) => {
          if (res.body) {
            for (let kline of res.body) {
              let klineData: KlineChartData = {
                time: kline[0],
                open: kline[1],
                high: kline[2],
                low: kline[3],
                close: kline[4],
              };

              this.klines.push(klineData);
            }

            this.candleStickSeries = this.chart.addCandlestickSeries();
            this.candleStickSeries.setData(this.klines);

            this.ws = await this.binanceService.getWebsocketInstance();
            this.binanceService.subscribeToPairWebsocket(
              this.symbol,
              this.interval
            );

            this.ws.addEventListener(
              'message',
              (event: MessageEvent<string>) => {
                const msg = JSON.parse(event.data);
                
                if (msg.e === 'kline' && msg.s === this.symbol) {
                  let kline: KlineChartData = {
                    time: msg.k.t as UTCTimestamp,
                    open: msg.k.o,
                    high: msg.k.h,
                    low: msg.k.l,
                    close: msg.k.c,
                  };
                  console.log('a');
                  if (!this.finish) {
                    this.finish = true;
                    this.klines[this.klines.length - 1] = kline;
                  } else {
                    this.klines.push(kline);
                  }
                  
                  this.candleStickSeries.update(
                    this.klines[this.klines.length - 1]
                  );
                }
              }
            );
          }
        });
    }
  }
}
