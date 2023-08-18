"use client";

import { useState, useEffect, useCallback } from "react";
import { Pet } from "./Pet";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network, Provider } from "aptos";
import { Mint } from "./Mint";

export const provider = new Provider(Network.DEVNET);

export function Connected() {
  const [pet, setPet] = useState<Pet>();
  const [isLoading, setIsLoading] = useState(true);
  const { account, network } = useWallet();

  const fetchPet = useCallback(async () => {
    if (!account?.address) return;

    // build a transaction payload to be submitted
    const payload = {
      function:
        "0xe8a7346fd49d2aeaa1ddd1c58c865eeb617c4f88870c8b0a25cfae2938eb5574::main::get_aptogotchi",
      type_arguments: [],
      arguments: [account.address],
    };

    setIsLoading(true);

    const response = await provider.view(payload);
    const noPet = ["", "0", "0", "0"];

    // if no pet exists, show minting component
    if (JSON.stringify(response) !== JSON.stringify(noPet)) {
      // get and set pet data from user's wallet
      setPet({
        name: response[0] as unknown as string,
        health_points: response[2] as unknown as number,
        happiness: response[3] as unknown as number,
      });
    }
    setIsLoading(false);
  }, [account?.address]);

  useEffect(() => {
    if (!account?.address || !network) return;

    fetchPet();
  }, [account?.address, fetchPet, network]);

  // TODO: Design a nice loading screen
  if (isLoading) return null;

  return (
    <div className="flex flex-col gap-3 p-3">
      {pet ? <Pet pet={pet} /> : <Mint fetchPet={fetchPet} />}
    </div>
  );
}
