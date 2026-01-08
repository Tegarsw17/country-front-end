"use client";

import { TrendingUp, TrendingDown, Info } from "lucide-react";
import { Market } from "@/hooks/useMarkets";
import PriceChart from "../charts/PriceChart";

interface Props {
  market: Market;
  price: number;
  onTrade: () => void;
}

export function MarketBottomSheet({ market, price, onTrade }: Props) {
  const isPositive = market.change24h >= 0;

  return (
    <div className="space-y-6 pb-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-800 border border-white/5 text-sm font-bold text-neutral-300 shadow-inner">
            {market.symbol.substring(0, 2)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white leading-none">
              {market.name}
            </h3>
            <p className="text-sm font-mono text-neutral-500 mt-1">
              {market.symbol}/USD
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-white font-mono tracking-tight">
            $
            {price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <div
            className={`flex items-center justify-end gap-1 text-sm font-bold ${
              isPositive ? "text-emerald-500" : "text-rose-500"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {isPositive ? "+" : ""}
            {market.change24h.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 p-4 min-h-[250px] shadow-inner">
        <div className="h-[325px] w-full">
          <PriceChart countryCode={market.symbol.substring(0, 2)}/>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/5 bg-neutral-900/30 p-3">
          <p className="text-xs text-neutral-500 mb-1 flex items-center gap-1">
            <Info className="w-3 h-3" /> 24h Volume
          </p>
          <p className="font-mono text-sm text-neutral-200">
            ${(market.volume24h || 0).toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-white/5 bg-neutral-900/30 p-3">
          <p className="text-xs text-neutral-500 mb-1">Index Base</p>
          <p className="font-mono text-sm text-neutral-200">
            {(market.basePrice || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Trade Button (CTA) */}
      <button
        onClick={onTrade}
        className="group relative w-full overflow-hidden rounded-xl bg-emerald-600 py-4 text-base font-bold text-white shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-900/40 active:scale-[0.98]"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          Trade {market.symbol}
          <TrendingUp className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </span>
        {/* Shine Effect Animation */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
      </button>
    </div>
  );
}
