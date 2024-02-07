"use client";

import { useState, useEffect, useCallback } from "react";
import { Pet } from "./Pet";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Mint } from "./Mint";
import { NEXT_PUBLIC_CONTRACT_ADDRESS } from "@/utils/env";
import { getAptosClient } from "@/utils/aptosClient";
import { Modal } from "@/components/Modal";

const RANDOMNET_ID = "70";

const aptosClient = getAptosClient();

export function Connected() {
  const [pet, setPet] = useState<Pet>();
  const [mintSuccess, setMintSuccess] = useState(false);
  const { account, network } = useWallet();

  const fetchPet = useCallback(async () => {
    if (!account?.address) return;

    const [hasPet] = await aptosClient.view({
      payload: {
        function: `${NEXT_PUBLIC_CONTRACT_ADDRESS}::main::has_aptogotchi`,
        functionArguments: [account.address],
      },
    });
    if (hasPet as boolean) {
      const response = await aptosClient.view({
        payload: {
          function: `${NEXT_PUBLIC_CONTRACT_ADDRESS}::main::get_aptogotchi`,
          functionArguments: [account.address],
        },
      });
      const [name, birthday, energyPoints, parts] = response;
      const typedParts = parts as { body: number; ear: number; face: number };
      setPet({
        name: name as string,
        birthday: birthday as number,
        energy_points: energyPoints as number,
        parts: typedParts,
      });
    }
  }, [account?.address]);

  useEffect(() => {
    if (!account?.address || !network) return;

    fetchPet();
  }, [account?.address, fetchPet, network]);

  return (
    <div className="flex flex-col gap-3 p-3">
      {network?.chainId !== RANDOMNET_ID && <Modal />}
      {pet ? (
        <Pet pet={pet} setPet={setPet} mintSuccess={mintSuccess} />
      ) : (
        <Mint fetchPet={fetchPet} onMintSuccess={() => setMintSuccess(true)} />
      )}
    </div>
  );
}
