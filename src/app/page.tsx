import dynamic from "next/dynamic";

export default function Home() {
  return (
    <main>
      <h1>Hello World</h1>
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
      <div className="inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded mr-4 opacity-50 cursor-not-allowed">
        Loading
      </div>
    ),
    ssr: false,
  }
);
