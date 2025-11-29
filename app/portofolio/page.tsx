"use client";

import React from "react";
import { StatCard } from "@/components/portofolio/StatCard";
import { walletCoins } from "@/lib/WalletConfig";
import { MantleSepoliaBalance } from "@/components/portofolio/MantleSepoliaBalance";

type Holding = {
    symbol: string;
    name: string;
    amount: number; // units held
    price: number; // current price per unit (USD)
    change24hPct: number; // percent change last 24h (e.g., 0.035 = +3.5%)
};

// Simple price source for symbols. Replace with live prices when available.
const priceBook: Record<string, { price: number; change24hPct: number; name?: string }> = {
    IDN: { price: 3550, change24hPct: 0.018, name: "Indonesian Shyntetic Nation Index" },
    USA: { price: 68000, change24hPct: -0.006, name: "US Shyntetic Nation Index" },
    JPN: { price: 185, change24hPct: 0.042, name: "JPN Shyntetic Nation Index" },
};

function usd(n: number) {
    return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

export default function Portofolio() {
    // Build holdings from wallet coin config + current priceBook
    const holdings: Holding[] = walletCoins.map((c) => {
        const p = priceBook[c.symbol];
        return {
            symbol: c.symbol,
            name: c.name ?? p?.name ?? c.symbol,
            amount: c.amount,
            price: p?.price ?? 0,
            change24hPct: p?.change24hPct ?? 0,
        } as Holding;
    });

    const totalValue = holdings.reduce((sum, h) => sum + h.amount * h.price, 0);

    // Yesterday value approximated by reversing 24h change
    const yesterdayValue = holdings.reduce(
        (sum, h) => sum + (h.amount * h.price) / (1 + (h.change24hPct || 0)),
        0
    );
    const pnl24h = totalValue - yesterdayValue;
    const pnl24hPct = yesterdayValue === 0 ? 0 : pnl24h / yesterdayValue;

    const best = [...holdings].sort((a, b) => b.change24hPct - a.change24hPct)[0];

    return (
        <div className="space-y-6">
            {/* Mantle Sepolia native MNT balance widget */}
            <MantleSepoliaBalance />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard label="Total Value" value={usd(totalValue)} subtitle="Current portfolio value" />
                <StatCard
                    label="24h PnL"
                    value={`${pnl24h >= 0 ? "+" : ""}${usd(pnl24h)} (${(pnl24hPct * 100).toFixed(2)}%)`}
                    subtitle="Since 24h"
                    tone={pnl24h >= 0 ? "positive" : "negative"}
                />
                <StatCard
                    label="Best Performer (24h)"
                    value={`${best.symbol} ${(best.change24hPct * 100).toFixed(2)}%`}
                    subtitle={best.name}
                    tone={best.change24hPct >= 0 ? "positive" : "negative"}
                />
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60">
                <div className="border-b border-slate-800 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-100">Holdings</p>
                </div>
                <div className="divide-y divide-slate-800">
                    <div className="grid grid-cols-12 gap-2 px-4 py-2 text-[11px] uppercase tracking-wide text-slate-400">
                        <div className="col-span-4">Asset</div>
                        <div className="col-span-2 text-right">Amount</div>
                        <div className="col-span-2 text-right">Price</div>
                        <div className="col-span-2 text-right">Value</div>
                        <div className="col-span-2 text-right">24h</div>
                    </div>
                    {holdings.map((h) => {
                        const value = h.amount * h.price;
                        const tone = h.change24hPct >= 0 ? "text-emerald-400" : "text-rose-400";
                        const sign = h.change24hPct >= 0 ? "+" : "";
                        return (
                            <div key={h.symbol} className="grid grid-cols-12 items-center gap-2 px-4 py-3 text-sm">
                                <div className="col-span-4 flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-[11px] font-semibold text-slate-200">
                                        {h.symbol}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-100">{h.name}</p>
                                        <p className="text-xs text-slate-500">{h.symbol}</p>
                                    </div>
                                </div>
                                <div className="col-span-2 text-right tabular-nums text-slate-100">{h.amount.toLocaleString()}</div>
                                <div className="col-span-2 text-right tabular-nums text-slate-100">{h.price ? usd(h.price) : "—"}</div>
                                <div className="col-span-2 text-right tabular-nums text-slate-100">{h.price ? usd(value) : "—"}</div>
                                <div className={`col-span-2 text-right tabular-nums ${tone}`}>
                                    {sign}
                                    {(h.change24hPct * 100).toFixed(2)}%
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}