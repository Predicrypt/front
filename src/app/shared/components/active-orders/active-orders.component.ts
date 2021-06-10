import { Component, Input, OnInit } from '@angular/core';
import { AccountTradeListResponse } from '../../interfaces/Binance/AccountTradeList';
import { OrderResponse } from '../../interfaces/Binance/AllOrders';
import { AuthService } from '../../services/auth.service';
import { BinanceService } from '../../services/binance.service';

@Component({
  selector: 'app-active-orders',
  templateUrl: './active-orders.component.html',
  styleUrls: ['./active-orders.component.scss'],
})
export class ActiveOrdersComponent implements OnInit {
  @Input() symbol: string;

  listTrades: AccountTradeListResponse[];
  constructor(private binanceService: BinanceService, public authService: AuthService) {}

  ngOnInit(): void {
    this.initOrders();
  }

  initOrders() {
    this.binanceService.getTrades(this.symbol).subscribe((res) => {
      this.listTrades = res.body || [];
    });
  }
}
