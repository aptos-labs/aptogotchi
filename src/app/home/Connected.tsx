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
    setIsLoading(true);

    const payload = {
      function:
        "0xb230322f28966237ee14b9d764f230b8ad9382653331ebb419d2909ea817a07f::main::get_aptogotchi",
      type_arguments: [],
      arguments: [account.address],
    };

    const response = await provider.view(payload);
    const noPet = ["", "0", "0", "0"];

    if (JSON.stringify(response) !== JSON.stringify(noPet)) {
      setPet({
        name: response[0] as unknown as string,
        health_points: parseInt(response[2] as unknown as string),
        happiness: parseInt(response[3] as unknown as string),
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
      {pet ? <Pet pet={pet} setPet={setPet} /> : <Mint fetchPet={fetchPet} />}
    </div>
  );
}
