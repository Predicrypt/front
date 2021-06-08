export interface CandlestickDataRequest {
  symbol: string;
  interval: string;
  startTime?: number;
  endTime?: number;
  limit?: number;
}
