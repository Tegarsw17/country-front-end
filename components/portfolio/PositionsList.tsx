"use client";

import { Loader2 } from "lucide-react";
import { PositionCard } from "@/components/portfolio/PositionCard";

interface PositionsListProps {
  positionIds: bigint[] | undefined;
  isLoading: boolean;
  onUpdate: () => void;
}

export function PositionsList({
  positionIds,
  isLoading,
  onUpdate,
}: PositionsListProps) {
  if (isLoading) {
    return (
      <div className="p-6 rounded-3xl bg-neutral-900/50 flex justify-center">
        <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {positionIds?.map((id, index) => (
        <PositionCard
          key={id.toString()}
          positionId={id}
          index={index}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
