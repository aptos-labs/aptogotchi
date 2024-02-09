"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network, NetworkToChainId } from "@aptos-labs/ts-sdk";

import { Mint } from "@/components/Mint";
import { Modal } from "@/components/Modal";

export function Connected() {
  const { network } = useWallet();

  return (
    <div className="flex flex-col gap-3 p-3">
      {network?.chainId !== NetworkToChainId[Network.RANDOMNET].toString() && (
        <Modal />
      )}
      <Mint />
    </div>
  );
}
