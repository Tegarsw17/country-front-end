"use client";

import { useState } from "react";
import { useWriteContract } from "wagmi";
import { Loader2, X, AlertCircle } from "lucide-react";
import { COUNTRY_TRADING_ADDRESS } from "@/config/addresses";
import { CountryTradingAbi } from "@/config/abis";

interface PartialCloseModalProps {
  positionId: bigint;
  maxSize: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function PartialCloseModal({ positionId, maxSize, onClose, onSuccess }: PartialCloseModalProps) {
  const [percentage, setPercentage] = useState(50);
  const { writeContractAsync, isPending } = useWriteContract();

  const handlePartialClose = async () => {
    try {
      // Logic: 100% = 10000 BPS
      const ratioBps = BigInt(Math.floor(percentage * 100));

      await writeContractAsync({
        address: COUNTRY_TRADING_ADDRESS,
        abi: CountryTradingAbi,
        functionName: "closePositionPartial",
        args: [positionId, ratioBps]
      });
      onSuccess();
      onClose();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-[#0F0F0F] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">Partial Close</h3>
          <button onClick={onClose} className="text-neutral-500 hover:text-white"><X className="w-5 h-5"/></button>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm mb-4">
            <span className="text-neutral-400">Amount to Close</span>
            <span className="font-mono text-white font-bold">{percentage}%</span>
          </div>
          
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={percentage} 
            onChange={(e) => setPercentage(Number(e.target.value))}
            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          
          <div className="flex justify-between text-xs text-neutral-500 mt-2">
            <span>1%</span>
            <span>50%</span>
            <span>100%</span>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-neutral-900 border border-neutral-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
            <p className="text-xs text-neutral-400">
              Closing <span className="text-white font-bold">{percentage}%</span> of position. 
              Remaining: <span className="text-white font-bold">{(maxSize * (100-percentage)/100).toFixed(2)}</span> tokens.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-lg font-bold text-neutral-400 hover:bg-neutral-800 hover:text-white transition">
            Cancel
          </button>
          <button 
            onClick={handlePartialClose}
            disabled={isPending}
            className="flex-1 py-3 rounded-lg bg-emerald-600 font-bold text-white hover:bg-emerald-500 transition disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin"/> : "Confirm Close"}
          </button>
        </div>
      </div>
    </div>
  )
}