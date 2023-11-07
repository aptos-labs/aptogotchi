"use client";

import { useState, useEffect, useCallback } from "react";
import { Aptogotchi } from "./Aptogotchi";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network, Provider } from "aptos";
import { Mint } from "./Mint";
import { Pet } from "./Pet";
import { Food } from "./Food";

export const provider = new Provider(Network.TESTNET);

export function Connected() {
  const [pet, setPet] = useState<Pet>();
  const [food, setFood] = useState<Food>();
  const { account, network } = useWallet();

  const fetchPet = useCallback(async () => {
    if (!account?.address) return;

    const payload = {
      function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::main::get_aptogotchi`,
      type_arguments: [],
      arguments: [account.address],
    };

    const response = await provider.view(payload);
    const noPet = ["", "0", "0", "0x"];

    if (JSON.stringify(response) !== JSON.stringify(noPet)) {
      setPet({
        name: response[0] as unknown as string,
        energy_points: parseInt(response[2] as unknown as string),
        parts: (response[3] as unknown as string).split("0").slice(2).map(Number),
        accessories: response[4] as unknown as string,
      });
    }
  }, [account?.address]);

  const fetchFood = useCallback(async () => {
    if (!account?.address) return;

    const payload = {
      type: "entry_function_payload",
      function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::food::get_food_balance`,
      type_arguments: [],
      arguments: [account.address],
    };

    const response = await provider.view(payload);
    const noFood = ["", "0", "0", "0x"];

    if (JSON.stringify(response) !== JSON.stringify(noFood)) {
      setFood({
        number: parseInt(response[0] as unknown as string),
      });
    }
  }, [account?.address]);

  useEffect(() => {
    if (!account?.address || !network) return;

    fetchPet();
    fetchFood();
  }, [account?.address, fetchPet, fetchFood, network]);

  return (
    <div className="flex flex-col gap-3 p-3">
      {pet && food ? (
        <Aptogotchi food={food} pet={pet} setPet={setPet} setFood={setFood} />
      ) : (
        <Mint fetchPet={fetchPet} />
      )}
    </div>
  );
}
