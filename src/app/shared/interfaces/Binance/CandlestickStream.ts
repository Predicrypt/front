
export interface CandlestickStream {
  e: string;
  E: number;
  s: string;
  k: CandlestickStreamData;
}

export interface CandlestickStreamData {
  t: number;
  T: number;
  s: string;
  i: String;
  f: number;
  L: number;
  o: number;
  c: number;
  h: number;
  l: number;
  v: number;
  n: number;
  x: boolean;
  q: number;
  V: number;
  Q: number;
  B: number;
}
