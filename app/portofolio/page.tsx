"use client";

import { useState } from "react";
import { useAccount, useReadContract, usePublicClient } from "wagmi";
import { Wallet } from "lucide-react";
import { COUNTRY_TRADING_ADDRESS } from "@/config/addresses";
import { CountryTradingAbi } from "@/config/abis";
import { usePortfolioStats } from "@/hooks/usePortfolioStats";
import { usePortfolioActions } from "@/hooks/usePortfolioActions";

// Import Komponen Modular
import { PortfolioHeader } from "@/components/portofolio/PortfolioHeader";
import { PositionsList } from "@/components/portofolio/PositionsList";
import { ActionModal } from "@/components/portofolio/ActionModal";

export default function PortfolioPage() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  
  // Custom Hooks
  const { walletBalance, protocolCollateral, refetchStats } = usePortfolioStats();
  const { deposit, withdraw, isPending } = usePortfolioActions();

  interface QueryOptions {
    pollInterval: number;
    enabled: boolean;
  }

  const { 
    data: positionIds, 
    refetch: refetchPositions, 
    isLoading: loadingPositions 
  } = useReadContract({
    address: COUNTRY_TRADING_ADDRESS,
    abi: CountryTradingAbi,
    functionName: "getUserPositions",
    args: [address as `0x${string}`],
    query: { pollInterval: 5000 } as QueryOptions,
  });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [txType, setTxType] = useState<"deposit" | "withdraw">("deposit");
  const [feedback, setFeedback] = useState<any>(null);

  const collateralVal = parseFloat(protocolCollateral || "0");
  
  // Handlers
  const openModal = (type: "deposit" | "withdraw") => {
    setTxType(type);
    setFeedback(null);
    setModalOpen(true);
  };

  const handleTransaction = async (amount: string) => {
    setFeedback(null);
    try {
      setFeedback({ type: "loading", message: "Please sign in your wallet..." });
      const txHash = txType === "deposit" ? await deposit(amount) : await withdraw(amount);

      if (txHash) {
        setFeedback({ type: "loading", message: "Transaction sent...", hash: txHash });
        if (publicClient) await publicClient.waitForTransactionReceipt({ hash: txHash });

        setFeedback({ type: "success", message: "Transaction confirmed!", hash: txHash });
        refetchStats();
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message?.split("\n")[0] || "Failed." });
    }
  };

  // Refresh semua data setelah ada aksi close position
  const handleUpdate = () => {
      refetchStats();
      refetchPositions();
  }

  return (
    <div className="min-h-screen max-w-5xl mx-auto bg-black text-white font-sans rounded-lg my-4 pb-20">
      <div className="mx-auto pt-8 px-5">
        
        {/* Title */}
        <header className="mb-6 flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-500">
          <Wallet className="w-5 h-5 text-emerald-500" />
          <h1 className="text-xl font-bold tracking-tight">Portfolio</h1>
        </header>

        {/* 1. Header Section (Balance & Actions) */}
        <PortfolioHeader 
            totalValue={collateralVal} // Bisa ditambah PnL jika mau hitung total net worth
            collateralValue={collateralVal}
            hasBalance={collateralVal > 0}
            onDeposit={() => openModal("deposit")}
            onWithdraw={() => openModal("withdraw")}
        />

        {/* 2. Positions List Section */}
        <PositionsList 
            positionIds={positionIds ? [...positionIds] : []} 
            isLoading={loadingPositions}
            onUpdate={handleUpdate}
        />

      </div>

      {/* 3. Transaction Modal (Deposit/Withdraw) */}
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