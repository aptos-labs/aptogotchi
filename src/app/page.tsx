import dynamic from "next/dynamic";

export default function Home() {
  return (
    <main className="flex justify-between px-4 py-3">
      <h1 className="text-2xl">Aptogotchi</h1>
      <div>
        <WalletButtons />
      </div>
    </main>
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
        Connect Wallet
      </div>
    ),
    ssr: false,
  }
);
