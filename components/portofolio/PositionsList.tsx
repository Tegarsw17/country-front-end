"use client";

import { Loader2, Box } from "lucide-react";
import { PositionCard } from "@/components/portofolio/PositionCard";

interface PositionsListProps {
  positionIds: bigint[] | undefined;
  isLoading: boolean;
  onUpdate: () => void;
}

export function PositionsList({ positionIds, isLoading, onUpdate }: PositionsListProps) {
  return (
    <div className="mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-sm font-bold text-neutral-400">
          Open Positions
        </h3>
        {positionIds && positionIds.length > 0 && (
          <span className="bg-neutral-900 text-white text-[10px] px-2 py-0.5 rounded-full border border-neutral-800 animate-in zoom-in duration-300">
            {positionIds.length} Active
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 rounded-2xl border border-neutral-800 bg-[#0A0A0A]">
          <Loader2 className="w-6 h-6 text-emerald-500 animate-spin mb-2" />
          <p className="text-xs text-neutral-500">Syncing positions...</p>
        </div>
      ) : !positionIds || positionIds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 rounded-2xl border border-neutral-800 border-dashed bg-[#0A0A0A]/50 transition-colors hover:border-neutral-700 hover:bg-[#0A0A0A]">
          <Box className="w-10 h-10 text-neutral-700 mb-3" />
          <p className="text-sm font-medium text-neutral-400">
            No active positions
          </p>
          <p className="text-xs text-neutral-600 mt-1">
            Start trading to see activity here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {positionIds.map((id, index) => (
             <PositionCard 
                key={id.toString()} 
                positionId={id} 
                index={index} 
                onUpdate={onUpdate} 
             />
          ))}
        </div>
      )}
    </div>
  );
}