import { PricePoint } from './priceSeries';

export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

export function toCandles(
  prices: PricePoint[],
  interval = 60 // seconds
): Candle[] {
  const buckets = new Map<number, Candle>();

  for (const p of prices) {
    const bucket = Math.floor(p.time / interval) * interval;

    const candle =
      buckets.get(bucket) ??
      {
        time: bucket,
        open: p.value,
        high: p.value,
        low: p.value,
        close: p.value,
      };

    candle.high = Math.max(candle.high, p.value);
    candle.low = Math.min(candle.low, p.value);
    candle.close = p.value;

    buckets.set(bucket, candle);
  }

  return Array.from(buckets.values()).sort(
    (a, b) => a.time - b.time
  );
}
