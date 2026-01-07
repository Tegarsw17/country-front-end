"use client";

import { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { formatUnits } from "viem";
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import {
  COUNTRY_TRADING_ADDRESS,
  COUNTRY_REGISTRY_ADDRESS,
} from "@/config/addresses";
import { CountryTradingAbi, CountryRegistryAbi } from "@/config/abis";
import { PartialCloseModal } from "./PartialCloseModal";

export function PositionCard({
  positionId,
  onUpdate,
  index,
}: {
  positionId: bigint;
  onUpdate: () => void;
  index: number;
}) {
  const { address } = useAccount();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPartialOpen, setIsPartialOpen] = useState(false);

  // --- CONTRACT READS ---
  const { data: pos } = useReadContract({
    address: COUNTRY_TRADING_ADDRESS,
    abi: CountryTradingAbi,
    functionName: "getPosition",
    args: [address as `0x${string}`, positionId],
  });

  const { data: countryData } = useReadContract({
    address: COUNTRY_REGISTRY_ADDRESS,
    abi: CountryRegistryAbi,
    functionName: "getCountry",
    args: [pos?.countryCode || "0x0"],
    query: { enabled: !!pos },
  });

  const { data: pnlData } = useReadContract({
    address: COUNTRY_TRADING_ADDRESS,
    abi: CountryTradingAbi,
    functionName: "getPositionPnL",
    args: [address as `0x${string}`, positionId],
    query: { enabled: !!pos, pollInterval: 2000 },
  });

  const { writeContractAsync: closeFull, isPending: isClosingFull } =
    useWriteContract();

  if (!pos || pos.entryPrice === 0n) return null;

  // --- DATA PROCESSING ---
  const countryName = countryData ? (countryData as any).name : "Loading...";
  const countryCode = countryName.substring(0, 2).toUpperCase();
  const size = parseFloat(formatUnits(pos.positionSize, 18));
  const collateral = parseFloat(formatUnits(pos.collateralAmount, 18));
  const entryPrice = parseFloat(formatUnits(pos.entryPrice, 18));
  const isLong = pos.isLong;

  let pnl = 0;
  let markPrice = entryPrice;
  if (pnlData) {
    pnl = parseFloat(formatUnits((pnlData as any)[0], 18));
    markPrice = parseFloat(formatUnits((pnlData as any)[1], 18));
  }

  // ROE %
  const roe = (pnl / collateral) * 100;
  const isProfit = pnl >= 0;

  // Est. Liq Price
  const threshold = 0.85;
  const liqPrice = isLong
    ? entryPrice * (1 - (collateral * threshold) / size)
    : entryPrice * (1 + (collateral * threshold) / size);

  const handleFullClose = async () => {
    try {
      await closeFull({
        address: COUNTRY_TRADING_ADDRESS,
        abi: CountryTradingAbi,
        functionName: "closePosition",
        args: [positionId],
      });
      onUpdate();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div
        className={`group rounded-2xl bg-[#0A0A0A]/60 backdrop-blur-md border transition-all overflow-hidden ${
          isExpanded
            ? "border-emerald-500/20 bg-[#0A0A0A]/80"
            : "border-white/5 hover:border-white/10 hover:bg-[#0A0A0A]/80"
        }`}
      >
        {/* MAIN ROW (Clickable) */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-5 flex justify-between md:grid md:grid-cols-12 gap-4 items-center cursor-pointer relative"
        >
          {/* 1. Asset & Side */}
          <div className="col-span-2 md:col-span-3 flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border shadow-lg transition-shadow ${
                isLong
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/10"
                  : "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-rose-500/10"
              }`}
            >
              {countryCode}
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                {countryName}
                <ChevronDown
                  className={`w-3 h-3 text-neutral-500 transition-transform duration-300 md:hidden ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    isLong
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-rose-500/20 text-rose-400"
                  }`}
                >
                  {isLong ? "Long" : "Short"}
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  1x
                </span>
              </div>
            </div>
          </div>

          {/* 2. Size */}
          <div className="hidden md:block col-span-2 text-right">
            <p className="text-sm font-mono text-white">
              {size.toFixed(2)} Units
            </p>
            <p className="text-xs text-neutral-500">
              ${(size * markPrice).toLocaleString()}
            </p>
          </div>

          {/* 3. Prices */}
          <div className="hidden md:block col-span-3 text-right">
            <div className="text-sm font-mono text-neutral-300">
              <span className="text-neutral-500 text-[10px] mr-2">ENTRY</span>$
              {entryPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </div>
            <div className="text-sm font-mono text-white">
              <span className="text-emerald-500 text-[10px] mr-2">MARK</span>$
              {markPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>

          {/* 4. Liq Price */}
          <div className="hidden md:block col-span-2 text-right">
            <p className="text-sm font-mono text-orange-400 flex items-center justify-end gap-1">
              <AlertTriangle className="w-3 h-3 opacity-50" />$
              {liqPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* 5. PnL */}
          <div className="col-span-2 md:col-span-2 text-right flex flex-col items-end justify-center">
            <p
              className={`text-sm font-bold font-mono ${
                isProfit ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {isProfit ? "+" : ""}
              {pnl.toFixed(2)} USD
            </p>
            <p
              className={`text-xs font-mono ${
                isProfit ? "text-emerald-500/70" : "text-rose-500/70"
              }`}
            >
              {roe.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* EXPANDED ACTIONS (ANIMATED) */}
        {/* Menggunakan grid-template-rows untuk transisi tinggi yang mulus */}
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isExpanded
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="border-t border-white/5 bg-white/[0.02] p-4 flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Mobile Details (Only visible on small screens) */}
              <div className="md:hidden w-full grid grid-cols-2 gap-4 text-xs mb-2">
                <div>
                  <span className="text-neutral-500 block mb-1">
                    Entry Price
                  </span>
                  <span className="text-white font-mono">
                    ${entryPrice.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-1">
                    Mark Price
                  </span>
                  <span className="text-white font-mono">
                    ${markPrice.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-1">
                    Liq. Price
                  </span>
                  <span className="text-orange-400 font-mono">
                    ${liqPrice.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-1">
                    Position Size
                  </span>
                  <span className="text-white font-mono">
                    ${(size * markPrice).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex w-full md:w-auto gap-3 justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPartialOpen(true);
                  }}
                  className="flex-1 md:flex-none px-4 py-2 rounded-lg border border-white/10 text-xs font-bold text-neutral-300 hover:bg-white/5 hover:text-white transition"
                >
                  Partial Close
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFullClose();
                  }}
                  disabled={isClosingFull}
                  className="flex-1 md:flex-none px-6 py-2 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition flex justify-center items-center gap-2"
                >
                  {isClosingFull && (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  )}
                  Close Position
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isPartialOpen && (
        <PartialCloseModal
          positionId={positionId}
          maxSize={size}
          onClose={() => setIsPartialOpen(false)}
          onSuccess={onUpdate}
        />
      )}
    </>
  );
}
