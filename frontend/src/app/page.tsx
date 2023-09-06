import dynamic from "next/dynamic";
import { Body } from "./home/Body";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Header />
      <Body />
    </main>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-10 flex flex-col justify-between sm:justify-center px-6 py-4 bg-gradient-to-r from-orange-300 via-orange-400 to-red-400 shadow-md w-full gap-2">
      <h1 className="text-2xl hidden sm:block">Aptogotchi</h1>
      <WalletButtons />
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
