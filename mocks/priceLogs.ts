export type MockPriceLog = {
  updatedAt: number; // unix timestamp (seconds)
  answer: number;    // raw price (like oracle)
};

// simulasi update price tiap ±20–40 detik
export const mockLogs: MockPriceLog[] = [
  { updatedAt: 1767170000, answer: 1500000 },
  { updatedAt: 1767170025, answer: 1512000 },
  { updatedAt: 1767170060, answer: 1498000 },
  { updatedAt: 1767170090, answer: 1520000 },
  { updatedAt: 1767170140, answer: 1535000 },
  { updatedAt: 1767170200, answer: 1510000 },
  { updatedAt: 1767170260, answer: 1540000 },
  { updatedAt: 1767170360, answer: 1640000 },
  { updatedAt: 1767170560, answer: 1040000 },
];
