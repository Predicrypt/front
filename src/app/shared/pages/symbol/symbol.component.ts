import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-symbol',
  templateUrl: './symbol.component.html',
  styleUrls: ['./symbol.component.scss'],
})
export class SymbolComponent implements OnInit {
  symbol: string;
  interval: string;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.symbol = params.symbol;

      if (params.interval) {
        this.interval = params.interval;
      } else {
        this.interval = '1h';
      }
    });
  }
}
