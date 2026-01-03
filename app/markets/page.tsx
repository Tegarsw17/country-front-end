"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { Search, TrendingUp, TrendingDown, Lock, Globe, BarChart3 } from "lucide-react";
import { useMarkets, Market } from "@/hooks/useMarkets";
import { COUNTRY_REGISTRY_ADDRESS } from "@/config/addresses";
import { CountryRegistryAbi } from "@/config/abis";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { MarketBottomSheet } from "@/components/markets/MarketBottomSheet";

// --- MOCK DATA ---
const COMING_SOON_MARKETS: Partial<Market>[] = [
  { id: "jpn-mock", name: "Japan", symbol: "JPN", isActive: false },
  { id: "cn-mock", name: "China", symbol: "CN", isActive: false },
  { id: "uk-mock", name: "United Kingdom", symbol: "UK", isActive: false },
  { id: "in-mock", name: "India", symbol: "IND", isActive: false },
  { id: "br-mock", name: "Brazil", symbol: "BRA", isActive: false },
];

// --- BACKGROUND FETCHER ---
const MarketPriceFetcher = ({
  marketId,
  onPriceUpdate,
}: {
  marketId: string;
  onPriceUpdate: (price: number) => void;
}) => {
  const { data } = useReadContract({
    address: COUNTRY_REGISTRY_ADDRESS,
    abi: CountryRegistryAbi,
    functionName: "getCountryPrice",
    args: [marketId as `0x${string}`],
    query: { refetchInterval: 5000 },
  });

  useEffect(() => {
    if (data) {
      const priceFloat = parseFloat(formatUnits(data[0], 18));
      onPriceUpdate(priceFloat);
    }
  }, [data, onPriceUpdate]);

  return null;
};

export default function MarketsPage() {
  const router = useRouter();
  const { markets: contractMarkets, isLoading } = useMarkets();
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);

  const handlePriceUpdate = useCallback((id: string, price: number) => {
    setPrices((prev) => {
      if (prev[id] === price) return prev;
      return { ...prev, [id]: price };
    });
  }, []);

  const handleNavigateToTrade = (marketId: string) => {
    router.push(`/trade`);
  };

  const filterMarkets = (markets: any[]) => {
    return markets.filter(
      (m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleMarketClick = (mkt: Market) => {
    setSelectedMarket(mkt);
  };

  const activeFiltered = filterMarkets(contractMarkets);
  const comingSoonFiltered = filterMarkets(COMING_SOON_MARKETS);

  if (isLoading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4 text-neutral-500">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        <p className="animate-pulse font-medium">Loading Markets...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-8 md:px-8 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 blur-[120px] -z-10 pointer-events-none" />

      {/* Background Fetchers */}
      {contractMarkets.map((mkt) => (
        <MarketPriceFetcher
          key={mkt.id}
          marketId={mkt.id}
          onPriceUpdate={(p) => handlePriceUpdate(mkt.id, p)}
        />
      ))}

      <div className="mx-auto max-w-5xl space-y-10">
        {/* === HEADER & SEARCH === */}
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">Global Markets</h1>
            <p className="text-neutral-400">Trade decentralized country indexes with leverage.</p>
          </div>

          <div className="relative group">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 transition-colors group-focus-within:text-emerald-500 text-neutral-500">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Search country or symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-md py-4 pl-12 pr-4 text-sm text-white placeholder-neutral-600 shadow-sm transition-all focus:border-emerald-500/50 focus:bg-neutral-900 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
            />
          </div>
        </div>

        {/* === TOP COUNTRY (ACTIVE) === */}
        {activeFiltered.length > 0 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            <div className="flex items-center gap-2 text-neutral-300">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              <h2 className="text-lg font-semibold">Top Performers</h2>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeFiltered.map((mkt) => {
                const currentPrice = prices[mkt.id] || 0;
                const isPositive = mkt.change24h >= 0;

                return (
                  <div
                    key={mkt.id}
                    onClick={() => handleMarketClick(mkt)}
                    className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/5 bg-neutral-900/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:bg-neutral-900/60 hover:shadow-2xl hover:shadow-emerald-900/10"
                  >
                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:from-emerald-500/5 group-hover:opacity-100" />

                    <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-800 border border-white/5 text-sm font-bold text-neutral-300 shadow-inner">
                            {mkt.symbol.substring(0, 2)}
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-lg leading-tight">{mkt.name}</h3>
                            <span className="text-xs font-mono text-neutral-500">{mkt.symbol}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs font-medium text-neutral-500 mb-1">Index Price</p>
                          <p className="text-2xl font-bold text-white tracking-tight font-mono">
                            ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div
                          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                            isPositive
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {mkt.change24h >= 0 ? "+" : ""}
                          {mkt.change24h.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* === ALL COUNTRIES (LIST VIEW) === */}
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
          <div className="flex items-center gap-2 text-neutral-300">
            <Globe className="h-5 w-5 text-neutral-500" />
            <h2 className="text-lg font-semibold">All Markets</h2>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/5 bg-neutral-900/30 backdrop-blur-sm">
            {/* Header */}
            <div className="grid grid-cols-12 border-b border-white/5 bg-white/[0.02] px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              <div className="col-span-5 md:col-span-4 pl-2">Country</div>
              <div className="col-span-4 md:col-span-3 text-right">Price</div>
              <div className="col-span-3 md:col-span-3 text-right hidden md:block">Volume (24h)</div>
              <div className="col-span-3 md:col-span-2 text-right pr-2">Analytics</div>
            </div>

            <div className="divide-y divide-white/5">
              {/* Active List */}
              {activeFiltered.map((mkt) => (
                <div
                  key={mkt.id}
                  onClick={() => handleMarketClick(mkt)}
                  className="group grid cursor-pointer grid-cols-12 items-center px-6 py-4 transition-colors hover:bg-white/[0.04]"
                >
                  <div className="col-span-5 flex items-center gap-4 md:col-span-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-800 text-[10px] font-bold text-neutral-400 border border-white/5 group-hover:border-emerald-500/30 group-hover:text-emerald-500 transition-colors">
                      {mkt.symbol.substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-200 group-hover:text-white transition-colors">{mkt.name}</p>
                      <p className="text-xs text-neutral-500 md:hidden">{mkt.symbol}</p>
                    </div>
                  </div>
                  <div className="col-span-4 text-right md:col-span-3">
                    <p className="font-mono font-medium text-neutral-200">
                      ${(prices[mkt.id] || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <p className={`text-xs font-medium ${mkt.change24h >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                      {mkt.change24h >= 0 ? "+" : ""}{mkt.change24h.toFixed(2)}%
                    </p>
                  </div>
                  <div className="col-span-3 text-right hidden md:block text-neutral-400 text-sm font-mono">
                    ${(mkt.volume24h || 0).toLocaleString()}
                  </div>
                  <div className="col-span-3 flex justify-end md:col-span-2">
                     <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarketClick(mkt);
                        }} 
                        className="group/btn flex items-center gap-2 rounded-lg border border-white/10 bg-transparent px-3 py-1.5 text-xs font-semibold text-neutral-400 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-500"
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Chart</span>
                     </button>
                  </div>
                </div>
              ))}

              {/* Coming Soon List */}
              {comingSoonFiltered.map((mkt) => (
                <div
                  key={mkt.id}
                  className="grid grid-cols-12 items-center px-6 py-4 opacity-50 grayscale transition-all hover:opacity-70 hover:grayscale-0"
                >
                  <div className="col-span-5 flex items-center gap-4 md:col-span-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-800 text-[10px] font-bold text-neutral-600 border border-white/5">
                      {mkt.symbol?.substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-500">{mkt.name}</p>
                      <span className="text-[10px] font-mono border border-neutral-800 bg-neutral-900 px-1.5 py-0.5 rounded text-neutral-600">SOON</span>
                    </div>
                  </div>
                  <div className="col-span-4 text-right md:col-span-3">
                    <p className="text-sm text-neutral-600 font-mono">---</p>
                  </div>
                  <div className="col-span-3 text-right hidden md:block text-neutral-600 text-sm">
                    ---
                  </div>
                  <div className="col-span-3 flex justify-end md:col-span-2">
                    <div className="flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-[10px] font-medium text-neutral-500">
                      <Lock className="h-3 w-3" /> Locked
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {activeFiltered.length === 0 && comingSoonFiltered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
                <Search className="h-10 w-10 opacity-20 mb-3" />
                <p>No country found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Sheet */}
        {selectedMarket && (
          <BottomSheet
            isOpen={!!selectedMarket}
            onClose={() => setSelectedMarket(null)}
          >
            <MarketBottomSheet
              market={selectedMarket}
              price={prices[selectedMarket.id] || 0}
              onTrade={() => handleNavigateToTrade(selectedMarket.id)}
            />
          </BottomSheet>
        )}
      </div>
    </div>
  );
}