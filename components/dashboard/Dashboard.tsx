"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const TICKER_SYMBOLS = ["IDN", "USA", "JPN", "SGP", "CHN", "GBR", "DEU", "FRA"];

export function Dashboard() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0", "translate-y-12");
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = document.querySelectorAll(".reveal-block");
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-black text-white selection:bg-emerald-500/30 font-sans">
      <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[800px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none z-0" />

      <section className="relative min-h-[100dvh] flex flex-col pt-6 px-6 md:px-12 overflow-hidden">
        <nav className="relative z-20 flex justify-between items-center reveal-block opacity-0 translate-y-12 transition-all duration-1000">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">
              Geo<span className="text-emerald-500">Bit</span>
            </span>
          </div>
          <a
            href="/trade"
            className="group flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
          >
            Launch App
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </nav>

        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <h1 className="text-[13vw] md:text-[10vw] font-medium tracking-tighter leading-[0.8] text-white mix-blend-overlay opacity-90 reveal-block opacity-0 translate-y-12 transition-all duration-1000 delay-100">
            TRADE THE
            <br />
            WORLD.
          </h1>

          <div className="mt-12 max-w-lg reveal-block opacity-0 translate-y-12 transition-all duration-1000 delay-200">
            <div className="h-px w-12 bg-emerald-500 mb-4" />
            <p className="text-neutral-400 text-lg md:text-xl leading-relaxed">
              Decentralized perpetuals for country indexes. <br />
              <span className="text-white">
                Long Economies. Short Inflation.
              </span>
            </p>
          </div>
        </div>

        <div className="relative z-20 border-t border-neutral-900 bg-black/50 backdrop-blur-sm mt-auto">
          <div className="flex w-max animate-ticker py-4">
            <style jsx>{`
              @keyframes ticker {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-50%);
                }
              }
              .animate-ticker {
                animation: ticker 60s linear infinite;
              }
            `}</style>
            {[...TICKER_SYMBOLS, ...TICKER_SYMBOLS, ...TICKER_SYMBOLS].map(
              (item, idx) => (
                <div
                  key={idx}
                  className="mx-8 font-mono text-xs text-neutral-500 tracking-widest"
                >
                  <span className="text-emerald-500/50 mr-2">●</span>
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-64 px-6 md:px-12 bg-black border-t border-neutral-900/50">
        <div className="max-w-5xl mx-auto text-center reveal-block opacity-0 translate-y-12 transition-all duration-1000">
          <span className="font-mono text-xs text-emerald-500 bg-emerald-500/5 px-3 py-1 rounded-full mb-8 inline-block tracking-widest border border-emerald-500/20">
            OUR THESIS
          </span>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight leading-tight text-white mb-8">
            Nations are the ultimate asset class.
            <br />
            <span className="text-neutral-500">
              Why aren't you trading them?
            </span>
          </h2>
          <p className="text-lg md:text-xl text-neutral-400 leading-relaxed max-w-3xl mx-auto font-light">
            Until now, speculating on GDP, inflation, or policy shifts was
            restricted to institutions.
            <span className="text-white font-medium">
              {" "}
              GeoBit democratizes macro.
            </span>{" "}
            We tokenize real-world economic data into tradable on-chain
            perpetuals, allowing you to hedge against currency debasement or bet
            on global growth.
          </p>
        </div>
      </section>

      <section className="relative z-10 pb-32 px-6 md:px-12 bg-black">
        <div className="mb-16 reveal-block opacity-0 translate-y-12 transition-all duration-1000">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-2">
            Core Features
          </h2>
          <div className="h-px w-12 bg-emerald-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(320px,auto)]">
          <div className="md:col-span-2 p-8 rounded-lg border border-neutral-800 bg-[#0A0A0A] hover:border-blue-500/50 hover:shadow-[inset_0_0_40px_rgba(59,130,246,0.05)] transition-all duration-500 group reveal-block opacity-0 translate-y-12 transition-all duration-1000 delay-100 relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-20">
              <div className="flex justify-between items-start mb-6">
                <span className="font-mono text-[10px] tracking-wider text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">
                  LIVE_FEED
                </span>
              </div>
              <h3 className="text-3xl font-medium mb-4 text-white">
                Swipe News Features
              </h3>
              <p className="text-neutral-400 max-w-md leading-relaxed">
                Stay ahead with curated geopolitical updates. Swipe through
                breaking news that impacts national economies directly from the
                terminal.
              </p>
            </div>

            <div className="relative mt-8 h-48 w-full md:absolute md:top-8 md:right-8 md:w-64 md:h-full md:mt-0 z-10 opacity-40 group-hover:opacity-60 transition-opacity duration-500 mask-image-gradient">
              <div className="flex flex-col gap-3">
                {[
                  { time: "10:42", text: "US CPI Data Release > Exp" },
                  { time: "10:38", text: "JP BOJ Rate Decision Pending" },
                  { time: "10:15", text: "UK GDP QoQ beats forecast" },
                  { time: "09:55", text: "IDN Trade Balance Surplus" },
                  { time: "09:30", text: "CN Manufacturing PMI Data" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-xs font-mono text-blue-200 border-b border-blue-500/10 pb-2"
                  >
                    <span className="text-blue-500 opacity-50">
                      [{item.time}]
                    </span>
                    <span className="truncate">{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent"></div>
            </div>
          </div>

          <div className="md:row-span-2 p-8 rounded-lg border border-neutral-800 bg-[#0A0A0A] hover:border-yellow-500/50 hover:shadow-[inset_0_0_40px_rgba(234,179,8,0.05)] transition-all duration-500 flex flex-col justify-between reveal-block opacity-0 translate-y-12 transition-all duration-1000 delay-200 overflow-hidden relative">
            <div className="relative z-10">
              <span className="font-mono text-[10px] tracking-wider text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20 mb-6 inline-block">
                MARKET_HOURS
              </span>
              <h3 className="text-3xl font-medium mb-4 text-white">
                24/7 Trading
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Markets never sleep. Trade global indexes continuously,
                bypassing traditional market open/close times.
              </p>
            </div>

            <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none">
              <div className="absolute inset-0 border border-yellow-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
              <div className="absolute inset-4 border border-dashed border-yellow-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
              <div className="absolute inset-12 border border-yellow-500/40 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.8)]"></div>
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-transparent to-yellow-500/10 animate-[spin_4s_linear_infinite]"></div>
            </div>
          </div>

          <div className="md:col-span-2 p-8 rounded-lg border border-neutral-800 bg-[#0A0A0A] hover:border-emerald-500/50 hover:shadow-[inset_0_0_40px_rgba(16,185,129,0.05)] transition-all duration-500 reveal-block opacity-0 translate-y-12 transition-all duration-1000 delay-300 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-[10px] tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                  INDEXES
                </span>
              </div>
              <h3 className="text-2xl font-medium mb-2 text-white">
                Macro Indexes
              </h3>
              <p className="text-neutral-400 text-sm max-w-lg">
                Speculate on GDP, Inflation rates, and Bond Yields via
                decentralized oracles. Real-world data on-chain.
              </p>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-32 px-8 flex items-end justify-between gap-1 opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none">
              {[
                40, 70, 30, 85, 50, 65, 90, 45, 60, 35, 75, 55, 80, 40, 60, 95,
                30, 50,
              ].map((height, i) => (
                <div
                  key={i}
                  className="w-full bg-gradient-to-t from-emerald-900/50 to-emerald-500 rounded-t-sm transition-all duration-700 ease-in-out"
                  style={{
                    height: `${height}%`,
                    opacity: 0.5 + height / 200,
                  }}
                ></div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-32 px-6 text-center bg-black border-t border-neutral-900 reveal-block opacity-0 translate-y-12 transition-all duration-1000 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="font-mono text-xs text-emerald-500 mb-6 flex items-center gap-2 bg-emerald-950/30 px-3 py-1 rounded border border-emerald-500/20">
            <span className="animate-pulse">●</span>
            LIVE
          </div>

          <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-white mb-6">
            Start Positioning.
          </h2>

          <p className="text-neutral-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Access on-chain nation indexes with leverage and deep liquidity.
            <span className="text-neutral-200 block mt-1">
              Trade macro like never before.
            </span>
          </p>

          <a
            href="/trade"
            className="group relative inline-flex items-center gap-4 px-10 py-5 border border-emerald-500 hover:bg-emerald-500 text-white tracking-wide transition-all duration-300 rounded-lg shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-10px_rgba(16,185,129,0.7)]"
          >
            <span className="relative z-10 flex items-center gap-3">
              LAUNCH TERMINAL
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
          </a>
        </div>

        <div className="mt-32 pt-8 border-t border-neutral-900/50 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs font-mono text-neutral-600 container mx-auto px-4 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-900 rounded-full animate-pulse"></div>
            <p>© 2025 GEOBIT.</p>
          </div>
          <div className="flex gap-8 mt-4 md:mt-0">
            <a href="#" className="hover:text-emerald-500 transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-emerald-500 transition-colors">
              Github
            </a>
            <a href="#" className="hover:text-emerald-500 transition-colors">
              Docs
            </a>
            <a href="#" className="hover:text-emerald-500 transition-colors">
              Terms
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
