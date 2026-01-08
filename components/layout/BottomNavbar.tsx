"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { bottomNav } from "@/config/Navigation";
import clsx from "clsx";

export default function BottomNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-[#020202]/90 backdrop-blur-xl md:hidden pb-safe">
      <div className="mx-auto flex h-[70px] max-w-md items-center justify-around px-2">
        {bottomNav.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={clsx(
                "group relative flex flex-1 flex-col items-center justify-center gap-1.5 py-2 transition-all duration-300",
                isActive
                  ? "text-emerald-400"
                  : "text-neutral-500 hover:text-neutral-300"
              )}
            >
              {isActive && (
                <span className="absolute -top-[1px] h-[2px] w-12 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-in fade-in zoom-in duration-300" />
              )}

              <div
                className={clsx(
                  "relative flex items-center justify-center rounded-xl p-1.5 transition-all duration-300",
                  isActive ? "bg-emerald-500/10" : "bg-transparent"
                )}
              >
                {Icon && (
                  <Icon
                    size={20}
                    className={clsx(
                      "transition-all duration-300",
                      isActive && "drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                    )}
                  />
                )}
              </div>

              <span className="text-[10px] font-medium tracking-wide">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
