"use client";

import { useState, useEffect, useCallback } from "react";
import { Pet } from "./Pet";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network, Provider } from "aptos";
import { Mint } from "./Mint";

export const provider = new Provider(Network.TESTNET);

export function Connected() {
  const [pet, setPet] = useState<Pet>();
  const { account, network } = useWallet();

  const fetchPet = useCallback(async () => {
    if (!account?.address) return;

    const getAptogotchiPayload = {
      function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::main::get_aptogotchi`,
      type_arguments: [],
      arguments: [account.address],
    };

    const getAptogotchiAddressPayload = {
      function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::main::get_aptogotchi_address`,
      type_arguments: [],
      arguments: [account.address],
    };

    const [aptogotchiResponse, aptogotchiAddressResponse] = await Promise.all([
      provider.view(getAptogotchiPayload),
      provider.view(getAptogotchiAddressPayload),
    ]);

    const noPet = ["", "0", "0", "0x"];

    if (JSON.stringify(aptogotchiResponse) !== JSON.stringify(noPet)) {
      setPet({
        name: aptogotchiResponse[0] as unknown as string,
        energy_points: parseInt(aptogotchiResponse[2] as unknown as string),
        parts: (aptogotchiResponse[3] as unknown as string)
          .split("0")
          .slice(2)
          .map(Number),
        address: aptogotchiAddressResponse[0] as unknown as string,
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
