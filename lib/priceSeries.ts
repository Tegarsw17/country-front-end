import { MockPriceLog } from '@/mocks/priceLogs';

export type PricePoint = {
  time: number;   // unix seconds
  value: number; // normalized price
};

export function toSeries(logs: MockPriceLog[]): PricePoint[] {
  return logs.map(l => ({
    time: l.updatedAt,
    value: l.answer / 1e6, // normalize
  }));
}
