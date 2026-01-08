"use client";

import { ArrowUpRight, Star } from "lucide-react";
import { MiniChart } from "./MiniChart";
import { Market } from "@/hooks/useMarkets";

interface MarketRowProps {
  market: Market | Partial<Market>;
  price?: number;
  change?: number;
  volume?: number;
  isFav?: boolean;
  isComingSoon?: boolean;
  onToggleFav?: (e: React.MouseEvent, id: string) => void;
  onClick?: () => void;
}

export const MarketRow = ({
  market,
  price = 0,
  change = 0,
  volume = 0,
  isFav = false,
  isComingSoon = false,
  onToggleFav,
  onClick,
}: MarketRowProps) => {
  const isPositive = change >= 0;

  if (isComingSoon) {
    return (
      <div className="grid grid-cols-12 items-center px-4 md:px-6 py-4 opacity-40 grayscale pointer-events-none bg-white/[0.01]">
        <div className="col-span-8 md:col-span-4 flex items-center gap-3 md:gap-4">
          <Star className="w-3.5 h-3.5 text-neutral-800" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-neutral-300">
              {market.name}
            </span>
            <span className="text-[10px] text-neutral-600 font-mono mt-0.5">
              {market.symbol}
            </span>
          </div>
        </div>
        <div className="col-span-4 md:col-span-8 flex justify-end md:pr-2">
          <span className="text-[9px] md:text-[10px] font-bold border border-white/10 bg-white/5 px-2 py-1 rounded text-neutral-500 tracking-wider">
            SOON
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="group grid grid-cols-12 items-center px-4 md:px-6 py-4 cursor-pointer hover:bg-white/[0.03] transition-colors border-b border-white/[0.02] last:border-0"
    >
      <div className="col-span-7 md:col-span-4 flex items-center gap-3 md:gap-4">
        <button
          onClick={(e) => onToggleFav && onToggleFav(e, market.id!)}
          className="p-1.5 -ml-1.5 hover:bg-white/10 rounded-full transition-colors z-10"
        >
          <Star
            className={`w-3.5 h-3.5 ${
              isFav
                ? "text-yellow-500 fill-yellow-500"
                : "text-neutral-600 hover:text-white"
            }`}
          />
        </button>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
            {market.name}
          </span>
          <span className="text-[10px] text-neutral-500 font-mono mt-0.5 flex items-center gap-1">
            {market.symbol}{" "}
            <span className="hidden md:inline text-neutral-700">/ USD</span>
          </span>
        </div>
      </div>

      <div className="col-span-5 md:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-0 text-right">
        <div className="flex flex-col justify-center md:items-end">
          <span className="text-sm font-mono text-neutral-200">
            ${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex flex-col justify-center items-end">
          <span
            className={`text-xs md:text-sm font-mono font-medium px-1.5 py-0.5 rounded md:bg-transparent ${
              isPositive
                ? "text-emerald-400 bg-emerald-500/10 md:bg-transparent"
                : "text-rose-400 bg-rose-500/10 md:bg-transparent"
            }`}
          >
            {isPositive ? "+" : ""}
            {change.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="hidden md:flex md:col-span-2 justify-end pr-4">
        <MiniChart isPositive={isPositive} />
      </div>

      <div className="hidden md:flex md:col-span-1 justify-end">
        <button className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100">
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
