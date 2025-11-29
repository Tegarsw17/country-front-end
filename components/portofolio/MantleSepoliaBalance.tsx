"use client";

import React from "react";
import { useAccount, useBalance, useChainId, useSwitchChain } from "wagmi";
import { mantleSepoliaTestnet } from "wagmi/chains";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function truncate(addr?: string) {
  if (!addr) return "";
  return addr.slice(0, 6) + "…" + addr.slice(-4);
}

export function MantleSepoliaBalance() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const needsSwitch = isConnected && chainId !== mantleSepoliaTestnet.id;

  const balance = useBalance({
    address,
    chainId: mantleSepoliaTestnet.id,
    query: { enabled: !!address },
  });

  return (
        <div className="mt-3 flex flex-col gap-2">
          {needsSwitch && (
            <button
              onClick={() => switchChain?.({ chainId: mantleSepoliaTestnet.id })}
              disabled={isSwitching}
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/15 disabled:opacity-60"
            >
              {isSwitching ? "Switching…" : "Switch to Mantle Sepolia"}
            </button>
          )}

          <div className="mt-1 grid grid-cols-2 items-center gap-2 text-sm">
            <span className="text-slate-400">Native MNT</span>
            <span className="text-right font-semibold text-slate-100">
              {balance.isLoading && "Loading…"}
              {balance.isError && "—"}
              {balance.data && `${balance.data.formatted} ${balance.data.symbol}`}
            </span>
          </div>
        </div>
  );
}
