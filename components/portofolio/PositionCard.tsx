"use client";

import { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { formatUnits } from "viem";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { COUNTRY_TRADING_ADDRESS, COUNTRY_REGISTRY_ADDRESS } from "@/config/addresses";
import { CountryTradingAbi, CountryRegistryAbi, OracleAbi } from "@/config/abis";
import { PartialCloseModal } from "./PartialCloseModal";

export function PositionCard({ positionId, onUpdate, index }: { positionId: bigint; onUpdate: () => void; index: number }) {
  const { address } = useAccount();
  const [isPartialOpen, setIsPartialOpen] = useState(false);

  const { data: pos } = useReadContract({
    address: COUNTRY_TRADING_ADDRESS,
    abi: CountryTradingAbi,
    functionName: "getPosition",
    args: [address as `0x${string}`, positionId]
  });

  const { data: countryData } = useReadContract({
    address: COUNTRY_REGISTRY_ADDRESS,
    abi: CountryRegistryAbi,
    functionName: "getCountry",
    args: [pos?.countryCode || "0x0"],
    query: { enabled: !!pos }
  });


  interface QueryOptions {
    enabled?: boolean;
    pollInterval?: number;
  }

  const oracleAddress = countryData ? (countryData as any).priceFeed : undefined;
  
  const { data: oracleData } = useReadContract({
    address: oracleAddress,
    abi: OracleAbi,
    functionName: "latestRoundData",
    query: { enabled: !!oracleAddress, pollInterval: 5000 } as QueryOptions,
  });

  const { writeContractAsync: closeFull, isPending: isClosingFull } = useWriteContract();
  
  const handleFullClose = async () => {
    try {
      await closeFull({
        address: COUNTRY_TRADING_ADDRESS,
        abi: CountryTradingAbi,
        functionName: "closePosition",
        args: [positionId]
      });
      onUpdate();
    } catch (e) { console.error(e); }
  };

  if (!pos || pos.entryPrice === 0n) return null;

  const countryName = countryData ? (countryData as any).name : "Loading...";
  const countryCodeShort = countryName.substring(0, 2).toUpperCase(); 
  
  const entryPrice = parseFloat(formatUnits(pos.entryPrice, 18)); 

  const size = parseFloat(formatUnits(pos.positionSize, 18));
  const isLong = pos.isLong;

  let pnl = 0;
  let pnlPercent = 0;
  let currentPrice = entryPrice;

  if (oracleData) {
      const priceRaw = (oracleData as any)[1];
      currentPrice = parseFloat(formatUnits(priceRaw, 8));

      if (isLong) {
          pnl = (currentPrice - entryPrice) * size;
      } else {
          pnl = (entryPrice - currentPrice) * size;
      }

      if (entryPrice !== 0) {
        pnlPercent = ((currentPrice - entryPrice) / entryPrice) * 100 * (isLong ? 1 : -1);
      }
  }

  const isProfit = pnl >= 0;

  return (
    <>
      <div
        style={{ animationDelay: `${index * 100}ms` }}
        className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-4 transition-all duration-300 hover:border-neutral-700 hover:bg-neutral-900/50 animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards"
      >
        {/* Color Indicator Bar */}
        <div className={`absolute left-0 top-0 h-full w-1 ${isLong ? 'bg-emerald-500' : 'bg-rose-500'}`} />

        <div className="flex flex-col gap-4 pl-2">
            {/* Top Row: Info */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-neutral-400 border border-neutral-800 group-hover:border-neutral-700 transition-colors">
                    {countryCodeShort}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {countryName}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${isLong ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
                            {isLong ? "Long" : "Short"}
                            </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5 font-mono">
                            Entry: ${entryPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 4})} • 
                            Mark: ${currentPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 4})}
                        </p>
                    </div>
                </div>

                {/* PnL Display */}
                <div className="text-right">
                    <div className={`flex items-center justify-end gap-1 font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                       {isProfit ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}
                       <span>{isProfit ? "+" : ""}{pnl.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} USDT</span>
                    </div>
                    <p className={`text-xs mt-0.5 ${isProfit ? 'text-emerald-500/70' : 'text-rose-500/70'}`}>
                        {isProfit ? "+" : ""}{pnlPercent.toFixed(2)}%
                    </p>
                </div>
            </div>

            {/* Bottom Row: Actions */}
            <div className="flex gap-2 pt-2 border-t border-neutral-800/50">
                <button 
                    onClick={() => setIsPartialOpen(true)}
                    className="flex-1 py-2 rounded-lg border border-neutral-800 text-xs font-bold text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
                >
                    Partial Close
                </button>
                <button 
                    onClick={handleFullClose}
                    disabled={isClosingFull}
                    className="flex-1 py-2 rounded-lg bg-neutral-800 text-xs font-bold text-white hover:bg-neutral-700 transition disabled:opacity-50 flex justify-center items-center"
                >
                    {isClosingFull ? <Loader2 className="w-3 h-3 animate-spin"/> : "Close Position"}
                </button>
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