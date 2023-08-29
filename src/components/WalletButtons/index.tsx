"use client";

import {
  useWallet,
  WalletReadyState,
  Wallet,
  isRedirectable,
  WalletName,
} from "@aptos-labs/wallet-adapter-react";

import { cn } from "@/utils/styling";

const buttonStyles = "nes-btn is-primary";

export const WalletButtons = () => {
  const { wallets, connected, disconnect, network, isLoading } = useWallet();

  if (connected) {
    // TODO: make network dropdown change network
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <select
          id="Network"
          className="bg-gray-50 text-sm rounded-lg block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          style={{ marginRight: "15px" }}
        >
          <option selected value="Devnet">
            Devnet
          </option>
          <option value="Testnet">Testnet</option>
          <option value="Mainnet">Mainnet</option>
        </select>
        <div
          className={cn(buttonStyles, "hover:bg-blue-700 btn-small")}
          onClick={disconnect}
        >
          Disconnect
        </div>
      </div>
    );
  }

  if (isLoading || !wallets[0]) {
    return (
      <div className={cn(buttonStyles, "opacity-50 cursor-not-allowed")}>
        Loading...
      </div>
    );
  }

  return <WalletView wallet={wallets[0]} />;
};

const WalletView = ({ wallet }: { wallet: Wallet }) => {
  const { connect } = useWallet();
  const isWalletReady =
    wallet.readyState === WalletReadyState.Installed ||
    wallet.readyState === WalletReadyState.Loadable;
  const mobileSupport = wallet.deeplinkProvider;

  const onWalletConnectRequest = async (walletName: WalletName) => {
    try {
      await connect(walletName);
    } catch (error) {
      console.warn(error);
      window.alert("Failed to connect wallet");
    }
  };

  /**
   * If we are on a mobile browser, adapter checks whether a wallet has a `deeplinkProvider` property
   * a. If it does, on connect it should redirect the user to the app by using the wallet's deeplink url
   * b. If it does not, up to the dapp to choose on the UI, but can simply disable the button
   * c. If we are already in a in-app browser, we don't want to redirect anywhere, so connect should work as expected in the mobile app.
   *
   * !isWalletReady - ignore installed/sdk wallets that don't rely on window injection
   * isRedirectable() - are we on mobile AND not in an in-app browser
   * mobileSupport - does wallet have deeplinkProvider property? i.e does it support a mobile app
   */
  if (!isWalletReady && isRedirectable()) {
    // wallet has mobile app
    if (mobileSupport) {
      return (
        <button
          className={cn(buttonStyles, "hover:bg-blue-700")}
          disabled={false}
          key={wallet.name}
          onClick={() => onWalletConnectRequest(wallet.name)}
        >
          Connect Wallet
        </button>
      );
    }
    // wallet does not have mobile app
    return (
      <button
        className={cn(buttonStyles, "opacity-50 cursor-not-allowed")}
        disabled={true}
        key={wallet.name}
      >
        Connect Wallet - Desktop Only
      </button>
    );
  } else {
    // desktop
    return (
      <button
        className={cn(
          buttonStyles,
          isWalletReady ? "hover:bg-blue-700" : "opacity-50 cursor-not-allowed"
        )}
        disabled={!isWalletReady}
        key={wallet.name}
        onClick={() => onWalletConnectRequest(wallet.name)}
      >
        Connect Wallet
      </button>
    );
  }
};
