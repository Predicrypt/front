import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PriceChange24hr } from '../../interfaces/Binance/24hrPriceChange';
import { BinanceService } from '../../services/binance.service';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-coins',
  templateUrl: './list-coins.component.html',
  styleUrls: ['./list-coins.component.scss'],
})
export class ListCoinsComponent implements OnInit {
  @Input() getTopCoins: boolean = false;

  coins: PriceChange24hr[] = [];
  copyCoins: PriceChange24hr[];
  searchForm: FormGroup;

  topCoins: string[] = [
    'BTCUSDT',
    'ETHUSDT',
    'BNBUSDT',
    'DOGEUSDT',
    'ADAUSDT',
    'XRPUSDT',
  ];
  constructor(private binanceService: BinanceService, private router: Router) {}

  ngOnInit(): void {
    if (!this.getTopCoins) {
      this.initCoins();
    } else {
      this.initTopCoins();
    }
    this.initForm();
  }

  initForm() {
    this.searchForm = new FormGroup({
      searchText: new FormControl(),
    });

    this.searchForm.controls.searchText.valueChanges
      .pipe(debounceTime(500))
      .subscribe((str) => {
        if (str) {
          console.log(str);
          this.searchPair(str);
        } else {
          this.coins = this.copyCoins;
        }
      });
  }

  initCoins() {
    this.binanceService.get24htAveragePrices().subscribe((res) => {
      if (res.body) {
        this.coins = res.body;
        if (!this.copyCoins) {
          this.copyCoins = res.body;
        }
      }
    });
  }

  initTopCoins() {
    for (let symbol of this.topCoins) {
      this.binanceService.get24htAveragePrice(symbol).subscribe((res) => {
        if (res.body) {
          this.coins.push(res.body);
        }
      });
    }
  }

  searchPair(text: string) {
    let temp = [];
    for (let coin of this.copyCoins) {
      if (coin.symbol.includes(text.toUpperCase())) {
        temp.push(coin);
      }
    }
    this.coins = temp;
  }

  goToSymbol(symbol: string) {
    this.router.navigate([`/symbol`], { queryParams: { symbol } });
  }
}
