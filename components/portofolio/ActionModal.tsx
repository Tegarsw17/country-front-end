"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";

interface ActionModalProps {
  isOpen: boolean;
  type: "deposit" | "withdraw";
  onClose: () => void;
  balance: string;
  onConfirm: (amount: string) => void;
  isPending: boolean;
  feedback: { type: string; message: string; hash?: string } | null;
}

export function ActionModal({
  isOpen,
  type,
  onClose,
  balance,
  onConfirm,
  isPending,
  feedback,
}: ActionModalProps) {
  const [amount, setAmount] = useState("");

  if (!isOpen) return null;

  return (
    // Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      {/* Modal Content */}
      <div className="w-full max-w-sm rounded-3xl border border-neutral-800 bg-[#0A0A0A] p-6 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold capitalize text-white">
            {type} USDT
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-800 transition text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert (Success/Error/Loading) */}
        {feedback && (
          <div
            className={`mb-4 p-3 rounded-xl border text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
              feedback.type === "success"
                ? "bg-emerald-900/20 border-emerald-500/30 text-emerald-400"
                : feedback.type === "error"
                ? "bg-rose-900/20 border-rose-500/30 text-rose-400"
                : "bg-neutral-800 border-neutral-700 text-neutral-300"
            }`}
          >
            {feedback.type === "loading" && (
              <Loader2 className="w-4 h-4 animate-spin mt-0.5" />
            )}
            <div>
              <p>{feedback.message}</p>
              {feedback.hash && (
                <a
                  href={`https://explorer.sepolia.mantle.xyz/tx/${feedback.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-xs mt-1 block opacity-70 hover:opacity-100"
                >
                  View on Explorer
                </a>
              )}
            </div>
          </div>
        )}

        {/* Input Form (Sembunyikan jika sukses agar bersih) */}
        {!feedback?.hash && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-neutral-900 p-4 border border-neutral-800 transition-colors focus-within:border-neutral-700">
              <div className="flex justify-between text-xs mb-2 text-neutral-500">
                <span>Amount</span>
                <span>Max: {parseFloat(balance).toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent text-2xl font-bold text-white placeholder:text-neutral-700 focus:outline-none"
                />
                <button
                  onClick={() => setAmount(balance)}
                  className="text-xs font-bold text-emerald-500 hover:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md transition-colors hover:bg-emerald-500/20"
                >
                  MAX
                </button>
              </div>
            </div>

            <button
              onClick={() => onConfirm(amount)}
              disabled={!amount || isPending || parseFloat(amount) <= 0}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] ${
                isPending
                  ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                  : type === "deposit"
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40"
                  : "bg-white hover:bg-neutral-200 text-black shadow-lg shadow-white/10"
              }`}
            >
              {isPending ? "Processing..." : `Confirm ${type}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}