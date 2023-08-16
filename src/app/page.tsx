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
    <header className="sticky top-0 flex justify-between items-center px-5 py-4 bg-orange-400 shadow-lg">
      <h1 className="text-2xl">Aptogotchi</h1>
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
