import { WalletProvider } from "@/context/WalletProvider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { PropsWithChildren } from "react";
import "nes.css/css/nes.min.css";
import "./globals.css";

const pkmn = localFont({ src: "./pkmn.ttf", variable: "--font-pkmn" });

export const metadata: Metadata = {
  title: "Aptogotchi",
  description: "Your new favorite on-chain pet",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={pkmn.className}>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
