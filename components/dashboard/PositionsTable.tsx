// components/dashboard/PositionsTable.tsx
import React from "react";

export type PositionStatus = "OPEN" | "CLOSED";

export type PositionSide = "LONG" | "SHORT";

export type Position = {
  id: string;
  market: string;
  side: PositionSide;
  leverage: number;
  sizeUsd: number;
  entryPrice: number;
  markPrice: number;
  pnlUsd: number;
  pnlPct: number;
  status: PositionStatus;
};

type PositionsTableProps = {
  positions: Position[];
};

export function PositionsTable({ positions }: PositionsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-xs">
        <thead>
          <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wide text-slate-400">
            <th className="py-2 pr-4">Market</th>
            <th className="py-2 pr-4">Side</th>
            <th className="py-2 pr-4">Lev</th>
            <th className="py-2 pr-4">Size</th>
            <th className="py-2 pr-4">Entry</th>
            <th className="py-2 pr-4">Mark</th>
            <th className="py-2 pr-4">PnL</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4"></th>
          </tr>
        </thead>
        <tbody>
          {positions.map((p) => {
            const sideClass =
              p.side === "LONG" ? "text-emerald-400" : "text-rose-400";
            const pnlClass =
              p.pnlUsd > 0
                ? "text-emerald-400"
                : p.pnlUsd < 0
                ? "text-rose-400"
                : "text-slate-200";

            return (
              <tr
                key={p.id}
                className="border-b border-slate-900/60 text-[11px] text-slate-200"
              >
                <td className="py-2 pr-4">{p.market}</td>
                <td className={`py-2 pr-4 font-semibold ${sideClass}`}>
                  {p.side}
                </td>
                <td className="py-2 pr-4">{p.leverage}x</td>
                <td className="py-2 pr-4">
                  ${p.sizeUsd.toLocaleString("en-US")}
                </td>
                <td className="py-2 pr-4">
                  {p.entryPrice.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="py-2 pr-4">
                  {p.markPrice.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className={`py-2 pr-4 font-medium ${pnlClass}`}>
                  {(p.pnlUsd >= 0 ? "+" : "") +
                    `$${p.pnlUsd.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}`}{" "}
                  <span className="text-[10px] text-slate-400">
                    ({p.pnlPct.toFixed(2)}%)
                  </span>
                </td>
                <td className="py-2 pr-4">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      p.status === "OPEN"
                        ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                        : "bg-slate-800 text-slate-300 border border-slate-700/60"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="py-2 pr-0 text-right">
                  {p.status === "OPEN" && (
                    <button className="rounded-full border border-slate-700 px-2 py-1 text-[10px] text-slate-200 hover:bg-slate-800">
                      Close
                    </button>
                  )}
                </td>
              </tr>
            );
          })}

          {positions.length === 0 && (
            <tr>
              <td
                colSpan={9}
                className="py-8 text-center text-[11px] text-slate-500"
              >
                Belum ada posisi. Mulai dengan membuka long / short di Markets.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
