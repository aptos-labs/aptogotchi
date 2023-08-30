"use client";

import { useState, useEffect, useCallback } from "react";
import { Pet } from "./Pet";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network, Provider } from "aptos";
import { Mint } from "./Mint";

export const provider = new Provider(Network.DEVNET);

export function Connected() {
  const [pet, setPet] = useState<Pet>();
  const { account, network } = useWallet();

  const fetchPet = useCallback(async () => {
    if (!account?.address) return;

    const payload = {
      function: `${process.env.NEXT_PUBLIC_REACT_APP_CONTRACT_ADDRESS}::main::get_aptogotchi`,
      type_arguments: [],
      arguments: [account.address],
    };

    const response = await provider.view(payload);
    console.log("CONNECTED: ", JSON.stringify(response));
    const noPet = ["", "0", "0", "0", "0x"];
    console.log("noPet: " + JSON.stringify(noPet));

    if (JSON.stringify(response) !== JSON.stringify(noPet)) {
      setPet({
        name: response[0] as unknown as string,
        health_points: parseInt(response[2] as unknown as string),
        happiness: parseInt(response[3] as unknown as string),
        parts: response[4] as unknown as string[],
      });
    }
  }, [account?.address]);

  useEffect(() => {
    if (!account?.address || !network) return;

    fetchPet();
  }, [account?.address, fetchPet, network]);

  return (
    <div className="flex flex-col gap-3 p-3">
      {pet ? <Pet pet={pet} setPet={setPet} /> : <Mint fetchPet={fetchPet} />}
    </div>
  );
}
