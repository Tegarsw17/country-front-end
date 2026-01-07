"use client";

import { ArrowDown, ArrowUp } from "lucide-react";

interface PortfolioHeaderProps {
  totalValue: number;
  collateralValue: number;
  hasBalance: boolean;
  onDeposit: () => void;
  onWithdraw: () => void;
}

export function PortfolioHeader({
  totalValue,
  collateralValue,
  hasBalance,
  onDeposit,
  onWithdraw,
}: PortfolioHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-[#0A0A0A] p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none animate-pulse duration-[3000ms]" />

      <div className="relative z-10">
        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
          Total Value
        </p>
        <h2 className="text-4xl font-bold text-white tracking-tight">
          ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h2>

        {/* Collateral Detail */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-xs text-neutral-400">Collateral:</span>
            <span className="text-xs font-bold text-white">${collateralValue.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={onDeposit}
            className="group relative flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-black transition-all duration-200 hover:bg-neutral-200 active:scale-95 shadow-lg shadow-white/5"
          >
            <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
            Deposit
          </button>

          {hasBalance ? (
            <button
              onClick={onWithdraw}
              className="group flex items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-neutral-800 hover:border-neutral-700 active:scale-95"
            >
              <ArrowUp className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
              Withdraw
            </button>
          ) : (
            <div className="flex items-center justify-center rounded-xl border border-neutral-900 bg-neutral-900/50 py-3 text-sm font-medium text-neutral-600 cursor-not-allowed">
              No funds
            </div>
          )}
        </div>
      </div>
    </div>
  );
}