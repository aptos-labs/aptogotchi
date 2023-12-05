"use client";

import { useState, useEffect, useCallback } from "react";
import { Pet } from "./Pet";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Mint } from "./Mint";
import { NEXT_PUBLIC_CONTRACT_ADDRESS } from "@/utils/env";
import { getAptosClient } from "@/utils/aptosClient";
import { Modal } from "@/components/Modal";

const TESTNET_ID = "2";

const aptosClient = getAptosClient();

export function Connected() {
  const [pet, setPet] = useState<Pet>();
  const { account, network } = useWallet();

  const fetchPet = useCallback(async () => {
    if (!account?.address) return;

    const [name, _, energyPoints, parts] = await aptosClient.view({
      payload: {
        function: `${NEXT_PUBLIC_CONTRACT_ADDRESS}::main::get_aptogotchi`,
        arguments: [account.address],
      },
    });

    const noPet = { name: "", birthday: 0, energyPoints: 0, parts: "0x" };
    if (name !== noPet.name) {
      setPet({
        name: name as string,
        energy_points: parseInt(energyPoints as string),
        parts: (parts as string).split("0").slice(2).map(Number),
      });
    }
  }, [account?.address]);

  useEffect(() => {
    if (!account?.address || !network) return;

    fetchPet();
  }, [account?.address, fetchPet, network]);

  return (
    <div className="flex flex-col gap-3 p-3">
      {network?.chainId !== TESTNET_ID && <Modal />}
      {pet ? <Pet pet={pet} setPet={setPet} /> : <Mint fetchPet={fetchPet} />}
    </div>
  );
}
