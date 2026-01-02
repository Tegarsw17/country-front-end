"use client";

import { GlobeHero } from "./GlobeHero";
import { 
  ArrowRight, 
  TrendingUp, 
  Globe, 
  ShieldAlert, 
  BarChart3, 
  Wallet, 
  Zap,
  Github,
  Twitter,
  Disc
} from "lucide-react";

// Mock Data
const TICKER_ITEMS = [
  { symbol: "IDN", price: "$124.50", change: "+2.4%", up: true },
  { symbol: "USA", price: "$340.10", change: "-0.5%", up: false },
  { symbol: "JPN", price: "$89.30", change: "-1.2%", up: false },
  { symbol: "SGP", price: "$210.00", change: "+0.8%", up: true },
  { symbol: "CHN", price: "$150.20", change: "+1.1%", up: true },
  { symbol: "GBR", price: "$112.40", change: "-0.3%", up: false },
  { symbol: "DEU", price: "$145.60", change: "+0.5%", up: true },
  { symbol: "FRA", price: "$108.90", change: "-0.1%", up: false },
];

export function Dashboard() {
  return (
    <div className="relative min-h-screen w-full bg-black text-white selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* --- HERO SECTION (Full Screen) --- */}
      <section className="relative h-screen flex flex-col justify-between">
        
        {/* Background Layers */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 z-0"
          style={{
            backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10" />

        {/* 3D Globe */}
        <div className="absolute inset-0 z-0 opacity-80 mix-blend-screen">
           <GlobeHero />
        </div>

        {/* Top Ticker */}
        <div className="relative z-20 w-full border-b border-white/10 bg-black/40 backdrop-blur-md overflow-hidden py-2">
          {/* Wrapper untuk animasi infinite loop */}
          <div className="flex w-max">
            {/* Render 2x untuk seamless loop */}
            {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 mx-6 text-xs font-mono">
                <span className="font-bold text-slate-300">{item.symbol}</span>
                <span className={item.up ? "text-emerald-400" : "text-rose-400"}>
                  {item.price} ({item.change})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 flex-1 flex items-center px-6 md:px-16 lg:px-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-widest uppercase mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              On-Chain Macro Trading
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-white animate-in fade-in slide-in-from-bottom-6 duration-1000">
              Short Your <span className="text-emerald-500 transparent-text-stroke">Country</span>,
              <br />
              Long Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Future.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-slate-400 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
              Express your macro view on nations through decentralized perpetuals. 
              Hedge inflation risk, trade GDP narratives, or bet on policy outcomes—directly from your wallet.
            </p>

            <div className="mt-10 flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              <a
                href="/trade"
                className="group relative inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-black transition-all hover:bg-emerald-400 hover:scale-105 active:scale-95"
              >
                Start Trading
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="/markets"
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-black/50 px-8 py-3.5 text-sm font-bold text-slate-200 backdrop-blur-md transition-all hover:bg-slate-800 hover:border-slate-500 active:scale-95"
              >
                View Markets
              </a>
            </div>
          </div>
        </div>

        {/* Hero Stats */}
        <div className="relative z-20 w-full border-t border-white/10 bg-black/60 backdrop-blur-xl px-6 md:px-16 lg:px-24 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Volume</p>
                <p className="text-2xl font-mono font-bold text-white">$24.5M+</p>
            </div>
            <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Active Countries</p>
                <p className="text-2xl font-mono font-bold text-white flex items-center gap-2">
                    8 <Globe className="w-4 h-4 text-emerald-500" />
                </p>
            </div>
            <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Oracle Updates</p>
                <p className="text-2xl font-mono font-bold text-white flex items-center gap-2">
                    ~2s <TrendingUp className="w-4 h-4 text-blue-500" />
                </p>
            </div>
            <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Security</p>
                <p className="text-2xl font-mono font-bold text-white flex items-center gap-2">
                    Audited <ShieldAlert className="w-4 h-4 text-emerald-500" />
                </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS / FEATURES --- */}
      <section className="relative z-10 py-24 bg-[#050505] border-t border-white/5">
        <div className="container mx-auto px-6 md:px-16 lg:px-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trade the <span className="text-emerald-500">Real World</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              We tokenize national economic performance into tradable indices. 
              Using real-time oracle data, you can speculate on the rise and fall of nations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="w-8 h-8 text-emerald-400" />,
                title: "Macro Indexes",
                desc: "Trade based on GDP, Inflation, and other key economic indicators aggregated from trusted off-chain oracles."
              },
              {
                icon: <Wallet className="w-8 h-8 text-blue-400" />,
                title: "Collateral Vault",
                desc: "Deposit USDT or MNT into our secure vault. Your collateral powers your positions with up to 50x leverage."
              },
              {
                icon: <Zap className="w-8 h-8 text-yellow-400" />,
                title: "Instant Execution",
                desc: "Built on Mantle Network for lightning-fast transactions and minimal gas fees."
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center mb-6 border border-white/10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 py-12 bg-black border-t border-white/10">
        <div className="container mx-auto px-6 md:px-16 lg:px-24 flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex flex-col gap-2">
            <span className="text-xl font-bold tracking-tight text-slate-50">
              Geo<span className="text-emerald-500">Bit</span>
            </span>
            <p className="text-xs text-slate-500">
              © 2025 GeoBit Protocol. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Disc className="w-5 h-5" /></a>
          </div>

        </div>
      </footer>

    </div>
  );
}