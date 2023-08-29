"use client";

import dynamic from "next/dynamic";
import { Body } from "./home/Body";
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Header />
      <Body />
    </main>
  );
}

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 flex justify-between items-center px-6 py-4 bg-gradient-to-r from-orange-300 via-orange-400 to-red-400 shadow-md w-full">
      <h1 className="text-2xl md:text-2xl">Aptogotchi</h1>
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          <RxHamburgerMenu />
        </button>
        {isOpen && <MobileWalletButtons />}
      </div>
      <div className="hidden md:block">
        <WalletButtons />
      </div>
    </header>
  );
}

const WalletButtons = dynamic(
  async () => {
    const { WalletButtons } = await import("@/components/WalletButtons");
    return { default: WalletButtons };
  },
  {
    loading: () => (
      <div className="nes-btn is-primary opacity-50 cursor-not-allowed">
        Loading...
      </div>
    ),
    ssr: false,
  }
);

const MobileWalletButtons = () => (
  <div className="relative">
    <div className="block">
      <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 flex flex-col">
        <div
          className="py-1"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <WalletButtons />
        </div>
      </div>
    </div>
  </div>
);
