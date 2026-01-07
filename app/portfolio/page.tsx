"use client";

import { useState, useMemo } from "react";
import {
  useAccount,
  useReadContract,
  useReadContracts,
  usePublicClient,
} from "wagmi";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  TrendingUp,
  Layers,
} from "lucide-react";
import { COUNTRY_TRADING_ADDRESS } from "@/config/addresses";
import { CountryTradingAbi } from "@/config/abis";
import { usePortfolioStats } from "@/hooks/usePortfolioStats";
import { usePortfolioActions } from "@/hooks/usePortfolioActions";
import { formatUnits } from "viem";

import { PositionsList } from "@/components/portfolio/PositionsList";
import { ActionModal } from "@/components/portfolio/ActionModal";

export default function PortfolioPage() {
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const { walletBalance, protocolCollateral, refetchStats } =
    usePortfolioStats();
  const { deposit, withdraw, isPending } = usePortfolioActions();

  const {
    data: positionIds,
    refetch: refetchPositions,
    isLoading: loadingIds,
  } = useReadContract({
    address: COUNTRY_TRADING_ADDRESS,
    abi: CountryTradingAbi,
    functionName: "getUserPositions",
    args: [address as `0x${string}`],
    query: { refetchInterval: 3000 },
  });

  const { data: positionsValues } = useReadContracts({
    contracts:
      positionIds?.map((id) => ({
        address: COUNTRY_TRADING_ADDRESS,
        abi: CountryTradingAbi,
        functionName: "getPositionPnL",
        args: [address as `0x${string}`, id],
      })) || [],
    query: {
      refetchInterval: 3000,
      enabled: !!positionIds && positionIds.length > 0,
    },
  });

  const { totalEquity, totalUnrealizedPnL } = useMemo(() => {
    const marginBalance = parseFloat(protocolCollateral || "0");
    let uPnL = 0;

    if (positionsValues) {
      positionsValues.forEach((result: any) => {
        if (result.status === "success" && result.result) {
          uPnL += parseFloat(formatUnits((result.result as any)[0], 18));
        }
      });
    }

    return {
      totalEquity: marginBalance + uPnL,
      totalUnrealizedPnL: uPnL,
    };
  }, [protocolCollateral, positionsValues]);

  const [modalOpen, setModalOpen] = useState(false);
  const [txType, setTxType] = useState<"deposit" | "withdraw">("deposit");
  const [feedback, setFeedback] = useState<any>(null);

  const openModal = (type: "deposit" | "withdraw") => {
    setTxType(type);
    setFeedback(null);
    setModalOpen(true);
  };

  const handleTransaction = async (amount: string) => {
    setFeedback(null);
    try {
      setFeedback({ type: "loading", message: "Broadcasting..." });
      const txHash =
        txType === "deposit" ? await deposit(amount) : await withdraw(amount);

      if (txHash) {
        setFeedback({
          type: "loading",
          message: "Confirming...",
          hash: txHash,
        });
        if (publicClient)
          await publicClient.waitForTransactionReceipt({ hash: txHash });

        setFeedback({ type: "success", message: "Confirmed.", hash: txHash });
        refetchStats();
        refetchPositions();
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message?.split("\n")[0] || "Failed.",
      });
    }
  };

  const handleUpdate = () => {
    refetchStats();
    refetchPositions();
  };

  return (
    <div className="min-h-screen w-full bg-[#020202] text-white font-sans pb-32 relative overflow-hidden selection:bg-emerald-500/20">
      <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none z-0 mix-blend-screen" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-12 md:pt-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Portfolio
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openModal("deposit")}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-500 text-white text-sm font-medium transition-all shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 cursor-pointer"
            >
              <ArrowDownLeft className="w-4 h-4" /> Deposit
            </button>
            <button
              onClick={() => openModal("withdraw")}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-emerald-600 text-white text-sm font-medium transition-all cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4" /> Withdraw
            </button>
          </div>
        </div>

        <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <div className="w-full p-8 md:p-10 rounded-3xl bg-[#0A0A0A]/60 backdrop-blur-md border border-white/5 relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <p className="text-neutral-400 text-xs font-medium tracking-wider uppercase mb-2 flex items-center gap-2">
                  Total Value
                </p>
                <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white drop-shadow-2xl">
                  $
                  {totalEquity.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h1>
              </div>

              <div className="flex gap-8 md:gap-16 text-start">
                <div>
                  <p className="text-neutral-500 text-xs mb-1 uppercase tracking-wide">
                    Margin Balance
                  </p>
                  <p className="font-mono text-xl text-white">
                    $
                    {parseFloat(protocolCollateral || "0").toLocaleString(
                      undefined,
                      { minimumFractionDigits: 2 }
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-500 text-xs mb-1 uppercase tracking-wide">
                    Unrealized PnL
                  </p>
                  <p
                    className={`font-mono text-xl flex items-center gap-2 ${
                      totalUnrealizedPnL >= 0
                        ? "text-emerald-400"
                        : "text-rose-400"
                    }`}
                  >
                    {totalUnrealizedPnL >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingUp className="w-4 h-4 rotate-180" />
                    )}
                    {totalUnrealizedPnL >= 0 ? "+" : ""}
                    {totalUnrealizedPnL.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none" />
          </div>
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-lg font-medium text-white flex items-center gap-2">
              Open Positions{" "}
              <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs px-2 py-0.5 rounded-full">
                {positionIds?.length || 0}
              </span>
            </h2>
          </div>

          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider border-b border-white/5 mb-2">
            <div className="col-span-3">Asset</div>
            <div className="col-span-2 text-right">Size</div>
            <div className="col-span-3 text-right">Entry / Mark</div>
            <div className="col-span-2 text-right">Liq. Price</div>
            <div className="col-span-2 text-right">PnL / ROE</div>
          </div>

          <div className="flex flex-col gap-3">
            {positionIds && positionIds.length > 0 ? (
              <PositionsList
                positionIds={[...positionIds]}
                isLoading={loadingIds}
                onUpdate={handleUpdate}
              />
            ) : (
              <div className="p-12 rounded-3xl border border-dashed border-neutral-800 bg-white/5 backdrop-blur-sm text-center">
                <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-3 text-neutral-500">
                  <Layers className="w-5 h-5" />
                </div>
                <p className="text-neutral-400 text-sm">No open positions.</p>
              </div>
            )}
          </div>
        </section>
      </div>
      <ActionModal
        isOpen={modalOpen}
        type={txType}
        onClose={() => setModalOpen(false)}
        balance={txType === "deposit" ? walletBalance : protocolCollateral}
        onConfirm={handleTransaction}
        isPending={isPending}
        feedback={feedback}
      />
    </div>
  );
}
