import { UTCTimestamp} from 'lightweight-charts/dist/typings'
export interface KlineChartData {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
}
