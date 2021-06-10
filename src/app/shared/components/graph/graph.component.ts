import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ChartOptions,
  createChart,
  CrosshairMode,
  DeepPartial,
  IChartApi,
  ISeriesApi,
  PriceScaleMode,
  UTCTimestamp,
} from 'lightweight-charts';
import {
  CandlestickStream,
  CandlestickStreamData,
} from '../../interfaces/Binance/CandlestickStream';
import { KlineChartData } from '../../interfaces/Binance/KlineChartData';
import { BinanceService } from '../../services/binance.service';
import { isBusinessDay } from 'lightweight-charts';
import { CandlestickIntervals } from '../../enums/CandlestickIntervals';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('graph') doc: ElementRef;
  @Input() symbol: string;
  @Input() interval: string;

  configChart: DeepPartial<ChartOptions>;
  chart: IChartApi;
  candleStickSeries: ISeriesApi<'Candlestick'>;
  ws: WebSocket;
  klines: KlineChartData[] = [];
  finish = false;
  intervalForm: FormGroup;

  constructor(private binanceService: BinanceService) {}

  ngOnInit(): void {
    this.initForm();
  }
  ngAfterContentInit() {
    this.initConfigChart();
    this.chart = createChart('graph', this.configChart);
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

  initForm() {
    let intervalTemp = this.interval
    this.intervalForm = new FormGroup({
      interval: new FormControl(intervalTemp),
    });

    this.intervalForm.controls.interval.valueChanges.subscribe((val) => {
      let lastInterval = this.interval;
      this.interval = val;
      this.changeIntervalChart(lastInterval);
    });
  }

  initConfigChart() {
    const doc = document.querySelector('.container-graph');
    this.configChart = {
      width: 1540,
      height: 600,
      layout: {
        backgroundColor: '#1B1D23',
        textColor: '#3B4049',
        fontFamily: "'IBM Plex Sans', sans-serif",
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        drawTicks: true,
      },
      localization: {
        locale: 'es-ES',
      },
      grid: {
        vertLines: { color: '#3B4049' },
        horzLines: { color: '#3B4049' },
      },
      timeScale: {
        fixLeftEdge: true,
      },
    };
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
                time: (parseInt(kline[0]) / 1000) as UTCTimestamp,
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
                    time: (parseInt(msg.k.t) / 1000) as UTCTimestamp,
                    open: msg.k.o,
                    high: msg.k.h,
                    low: msg.k.l,
                    close: msg.k.c,
                  };
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

  changeIntervalChart(interval: string) {
    this.klines = [];
    this.binanceService
      .getKlinesData({
        symbol: this.symbol,
        interval: this.interval,
      })
      .subscribe(async (res) => {
        if (res.body) {
          for (let kline of res.body) {
            let klineData: KlineChartData = {
              time: (parseInt(kline[0]) / 1000) as UTCTimestamp,
              open: kline[1],
              high: kline[2],
              low: kline[3],
              close: kline[4],
            };

            this.klines.push(klineData);
          }

          this.candleStickSeries.setData(this.klines);
          this.binanceService.unsubscribefromPairWebsocket(
            this.symbol,
            interval
          );
          this.binanceService.subscribeToPairWebsocket(
            this.symbol,
            this.interval
          );

          this.ws.addEventListener('message', (event: MessageEvent<string>) => {
            const msg = JSON.parse(event.data);

            if (msg.e === 'kline' && msg.s === this.symbol) {
              let kline: KlineChartData = {
                time: (parseInt(msg.k.t) / 1000) as UTCTimestamp,
                open: msg.k.o,
                high: msg.k.h,
                low: msg.k.l,
                close: msg.k.c,
              };
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
          });
        }
      });
  }

  getIntervals() {
    let intervals = [];
    for (const interval of this.enumKeys(CandlestickIntervals)) {
      intervals.push(CandlestickIntervals[interval]);
    }

    return intervals;
  }

  private enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
    return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
  }
}
