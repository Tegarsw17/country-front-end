// components/dashboard/Dashboard.tsx
"use client";

import { useState } from "react";
import { StatCard } from "./StatCard";
import { PositionsTable, Position } from "./PositionsTable";

const mockPositions: Position[] = [
  {
    id: "1",
    market: "IDN Index",
    side: "LONG",
    leverage: 5,
    sizeUsd: 1200,
    entryPrice: 100,
    markPrice: 108,
    pnlUsd: 96,
    pnlPct: 8,
    status: "OPEN",
  },
  {
    id: "2",
    market: "USA Index",
    side: "SHORT",
    leverage: 3,
    sizeUsd: 800,
    entryPrice: 150,
    markPrice: 142,
    pnlUsd: 64,
    pnlPct: 8.2,
    status: "OPEN",
  },
  {
    id: "3",
    market: "JPN Index",
    side: "LONG",
    leverage: 2,
    sizeUsd: 500,
    entryPrice: 90,
    markPrice: 87,
    pnlUsd: -16,
    pnlPct: -3.2,
    status: "CLOSED",
  },
];

export function Dashboard() {
  const [positions] = useState<Position[]>(mockPositions);

  const totalEquity = 2500; // nanti ambil dari backend / wallet
  const totalPnL = positions.reduce((acc, p) => acc + p.pnlUsd, 0);
  const openPositions = positions.filter((p) => p.status === "OPEN").length;

  return (
    // wrapper untuk tinggi layar & center vertical
    <div className=" flex items-center">
      <div className=" flex w-full px-0 py-0 lg:py-24">
        <div className="grid w-full items-center gap-10 md:grid-cols-2">
          {/* KIRI: tagline + deskripsi + tombol */}
          <div>
            <p className="text-3xl font-semibold text-slate-50 md:text-4xl lg:text-5xl">
              Short Your{" "}
              <span className="font-bold text-emerald-400">Country,</span>
              <br />
              Short Your{" "}
              <span className="font-bold text-emerald-400">Governments.</span>
            </p>

            <p className="mt-4 max-w-xl text-sm text-slate-300 md:text-base">
              Express your macro view on nations through on-chain long/short
              positions. Hedge risk, trade narratives, or simply bet on policy
              outcomes—directly from your wallet.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/markets"
                className="rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
              >
                Start Trading
              </a>
              <a
                href="/markets"
                className="rounded-full border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800 transition-colors"
              >
                View Markets
              </a>
            </div>
          </div>

          {/* KANAN: StatCard */}
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard
              label="Total Equity"
              value={`$${totalEquity.toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}`}
              subtitle="Wallet + unrealized PnL"
            />
            <StatCard
              label="Total PnL"
              value={
                (totalPnL >= 0 ? "+" : "") +
                `$${totalPnL.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}`
              }
              subtitle="Realized + unrealized"
              tone={totalPnL >= 0 ? "positive" : "negative"}
            />
            <StatCard
              label="Open Positions"
              value={openPositions.toString()}
              subtitle="Across all nation indexes"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
