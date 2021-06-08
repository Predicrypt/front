import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderSide } from '../../enums/OrderSide';
import { OrderTypes } from '../../enums/OrderTypes';
import { BinanceService } from '../../services/binance.service';

@Component({
  selector: 'app-order-tab',
  templateUrl: './order-tab.component.html',
  styleUrls: ['./order-tab.component.scss'],
})
export class OrderTabComponent implements OnInit {
  @Input() side: 'BUY' | 'SELL';
  @Input() symbol: string;
  supportedOrders = [
    { name: 'Market', value: OrderTypes.MARKET },
    { name: 'Limit', value: OrderTypes.LIMIT },
  ];
  formOrder: FormGroup;
  constructor(private binanceService: BinanceService) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formOrder = new FormGroup({
      symbol: new FormControl(this.symbol, Validators.required),
      type: new FormControl(OrderTypes.MARKET, Validators.required),
      side: new FormControl(this.side, Validators.required),
      quantity: new FormControl(0, Validators.required),
      price: new FormControl(null),
    });
  }

  doOrder() {
    this.binanceService.postOrder(this.formOrder.value).subscribe(console.log);
  }
}
