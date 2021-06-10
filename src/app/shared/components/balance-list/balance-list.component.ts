import { Component, OnInit } from '@angular/core';
import { Balance } from '../../interfaces/BalanceData';
import { BinanceService } from '../../services/binance.service';
import { UserService } from '../../services/user.service';



@Component({
  selector: 'app-balance-list',
  templateUrl: './balance-list.component.html',
  styleUrls: ['./balance-list.component.scss'],
})
export class BalanceListComponent implements OnInit {
  listBalances: Balance[] = [];
  constructor(
    private binanceService: BinanceService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initBalances();
  }

  initBalances() {
    this.userService.getBalances().subscribe((res) => {
      this.listBalances = res.body || [];
      console.log(this.listBalances)
    });
  }

  Number(n: any){
    return Number(n);
  }
}
