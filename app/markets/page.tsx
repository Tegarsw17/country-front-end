"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { Loader2 } from "lucide-react";
import { useMarkets, Market } from "@/hooks/useMarkets";
import { COUNTRY_REGISTRY_ADDRESS } from "@/config/addresses";
import { CountryRegistryAbi } from "@/config/abis";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { MarketBottomSheet } from "@/components/markets/MarketBottomSheet";
import { MarketsToolbar } from "@/components/markets/MarketsToolbar";
import { MarketRow } from "@/components/markets/MarketRow";

const COMING_SOON_MARKETS: Partial<Market>[] = [
  { id: "jpn-mock", name: "Japan", symbol: "JPN", isActive: false },
  { id: "cn-mock", name: "China", symbol: "CN", isActive: false },
  { id: "uk-mock", name: "United Kingdom", symbol: "UK", isActive: false },
];

const MarketDataFetcher = ({
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

  const lastPriceRef = useRef<number>(0);

  useEffect(() => {
    if (data) {
      const priceFloat = parseFloat(formatUnits(data[0], 18));

      if (priceFloat !== lastPriceRef.current) {
        lastPriceRef.current = priceFloat;
        onPriceUpdate(priceFloat);
      }
    }
  }, [data, onPriceUpdate]);

  return null;
};

export default function MarketsPage() {
  const router = useRouter();
  const { markets: contractMarkets, isLoading } = useMarkets();

  const [marketStats, setMarketStats] = useState<
    Record<string, { price: number; change: number }>
  >({});

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "ALL" | "FAVORITES" | "GAINERS" | "LOSERS"
  >("ALL");
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const storedFavs = localStorage.getItem("geobit_favorites");
    if (storedFavs) setFavorites(JSON.parse(storedFavs));
  }, []);

  const toggleFavorite = (e: React.MouseEvent, marketId: string) => {
    e.stopPropagation();
    let newFavs;
    if (favorites.includes(marketId)) {
      newFavs = favorites.filter((id) => id !== marketId);
    } else {
      newFavs = [...favorites, marketId];
    }
    setFavorites(newFavs);
    localStorage.setItem("geobit_favorites", JSON.stringify(newFavs));
  };

  const handleDataUpdate = useCallback((id: string, price: number) => {
    setMarketStats((prev) => {
      const current = prev[id] || { price: 0, change: 0 };

      if (current.price === price) return prev;

      const seed = Math.sin(price) * 10000;
      const mockChange = parseFloat((seed % 5).toFixed(2));

      return {
        ...prev,
        [id]: { price, change: mockChange },
      };
    });
  }, []);

  const handleNavigateToTrade = (marketId: string) => {
    router.push(`/trade`);
  };

  const filteredMarkets = useMemo(() => {
    let data = [...contractMarkets];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (m) =>
          m.name.toLowerCase().includes(q) || m.symbol.toLowerCase().includes(q)
      );
    }

    if (activeTab === "FAVORITES") {
      data = data.filter((m) => favorites.includes(m.id));
    } else if (activeTab === "GAINERS") {
      data = data
        .filter((m) => (marketStats[m.id]?.change || 0) > 0)
        .sort(
          (a, b) =>
            (marketStats[b.id]?.change || 0) - (marketStats[a.id]?.change || 0)
        );
    } else if (activeTab === "LOSERS") {
      data = data
        .filter((m) => (marketStats[m.id]?.change || 0) < 0)
        .sort(
          (a, b) =>
            (marketStats[a.id]?.change || 0) - (marketStats[b.id]?.change || 0)
        );
    }

    return data;
  }, [contractMarkets, searchQuery, activeTab, favorites, marketStats]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center text-neutral-500">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#020202] text-white font-sans pb-24 md:pb-20 relative overflow-hidden selection:bg-emerald-500/20">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/5 blur-[150px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0 opacity-20" />

      {contractMarkets.map((mkt) => (
        <MarketDataFetcher
          key={mkt.id}
          marketId={mkt.id}
          onPriceUpdate={(p) => handleDataUpdate(mkt.id, p)}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-8">
        <MarketsToolbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearchOpen={isSearchOpen}
          setIsSearchOpen={setIsSearchOpen}
        />

        <div className="rounded-xl border border-white/5 bg-[#0A0A0A]/40 backdrop-blur-sm overflow-hidden">
          <div className="hidden md:grid grid-cols-12 px-6 py-3 border-b border-white/5 text-[10px] font-medium uppercase tracking-wider text-neutral-500 bg-white/[0.02]">
            <div className="col-span-4 pl-2">Instrument</div>
            <div className="col-span-5 grid grid-cols-2 text-right">
              <span>Price</span>
              <span>Change</span>
            </div>
            <div className="col-span-2 text-right pr-4">Trend</div>
            <div className="col-span-1 text-right pr-2">Action</div>
          </div>

          <div className="divide-y divide-white/5">
            {filteredMarkets.length > 0 ? (
              filteredMarkets.map((mkt) => {
                const stats = marketStats[mkt.id] || { price: 0, change: 0 };
                return (
                  <MarketRow
                    key={mkt.id}
                    market={mkt}
                    price={stats.price}
                    change={stats.change}
                    isFav={favorites.includes(mkt.id)}
                    onToggleFav={toggleFavorite}
                    onClick={() => {
                      setSelectedMarket(mkt);
                    }}
                  />
                );
              })
            ) : (
              <div className="py-20 text-center text-neutral-600 text-sm">
                {activeTab === "FAVORITES"
                  ? "No favorites yet."
                  : "No markets found."}
              </div>
            )}

            {!searchQuery &&
              activeTab === "ALL" &&
              COMING_SOON_MARKETS.map((mkt) => (
                <MarketRow key={mkt.id} market={mkt} isComingSoon />
              ))}
          </div>
        </div>
      </div>

      {selectedMarket && (
        <BottomSheet
          isOpen={!!selectedMarket}
          onClose={() => setSelectedMarket(null)}
        >
          <MarketBottomSheet
            market={selectedMarket}
            price={marketStats[selectedMarket.id]?.price || 0}
            onTrade={() => handleNavigateToTrade(selectedMarket.id)}
          />
        </BottomSheet>
      )}
    </div>
  );
}
