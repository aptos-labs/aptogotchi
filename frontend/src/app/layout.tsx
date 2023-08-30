import { WalletProvider } from "@/context/WalletProvider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { PropsWithChildren } from "react";
import "nes.css/css/nes.min.css";
import "./globals.css";

const kongtext = localFont({
  src: "./../../public/kongtext.ttf",
  variable: "--font-kongtext",
});

export const metadata: Metadata = {
  title: "Aptogotchi",
  description: "Your new favorite on-chain pet",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={kongtext.className}>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
