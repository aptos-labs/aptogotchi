"use client";

import { useState, useEffect, useCallback } from "react";
import { Pet } from "./Pet";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network, Provider } from "aptos";
import { Mint } from "./Mint";

export const provider = new Provider(Network.TESTNET);

export function Connected() {
  const [pet, setPet] = useState<Pet>();
  const [collectionID, setCollectionID] = useState<string>();
  const { account, network } = useWallet();

  const fetchPet = useCallback(async () => {
    if (!account?.address) return;

    const getAptogotchiPayload = {
      function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::main::get_aptogotchi`,
      type_arguments: [],
      arguments: [account.address],
    };

    const aptogotchiResponse = await provider.view(getAptogotchiPayload);

    const noPet = ["", "0", "0", "0x"];

    if (JSON.stringify(aptogotchiResponse) !== JSON.stringify(noPet)) {
      setPet({
        name: aptogotchiResponse[0] as unknown as string,
        energy_points: parseInt(aptogotchiResponse[2] as unknown as string),
        parts: (aptogotchiResponse[3] as unknown as string)
          .split("0")
          .slice(2)
          .map(Number),
      });
    }
  }, [account?.address]);

  const fetchCollectionID = useCallback(async () => {
    if (!account?.address) return;

    const getAptogotchiCollectionIDPayload = {
      function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::main::get_aptogotchi_collection_id`,
      type_arguments: [],
      arguments: [],
    };

    const aptogotchiCollectionIDResponse = (await provider.view(
      getAptogotchiCollectionIDPayload
    )) as string[];

    setCollectionID(aptogotchiCollectionIDResponse[0]);
  }, [account?.address]);

  useEffect(() => {
    if (!account?.address || !network) return;

    fetchPet();
  }, [account?.address, fetchPet, network]);

  useEffect(() => {
    if (!account?.address || !network) return;

    fetchCollectionID();
  }, [fetchCollectionID, network]);

  return (
    <div className="flex flex-col gap-3 p-3">
      {collectionID ? (
        pet ? (
          <Pet pet={pet} setPet={setPet} collectionID={collectionID} />
        ) : (
          <Mint fetchPet={fetchPet} />
        )
      ) : null}
    </div>
  );
}
