import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { Web3Provider } from "../lib/WalletConfig";
import ClientLayout from "@/components/layout/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GeoBit",
  description: "On-chain long/short index of nations",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-slate-100`}>
        <Web3Provider>
          <ClientLayout>{children}</ClientLayout>
        </Web3Provider>
      </body>
    </html>
  );
}
