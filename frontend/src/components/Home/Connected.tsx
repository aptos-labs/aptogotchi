"use client";

import { useState, useEffect, useCallback } from "react";
import { Pet, MyPets, PetParts } from "../Pet";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Mint } from "../Mint";
import { NEXT_PUBLIC_CONTRACT_ADDRESS } from "@/utils/env";
import { getAptosClient } from "@/utils/aptosClient";
import { Modal } from "@/components/Modal";
import { padAddressIfNeeded } from "@/utils/address";
import { Network, NetworkToChainId } from "@aptos-labs/ts-sdk";

const aptosClient = getAptosClient();

const getAptogotchiByAddress = async (address: string): Promise<Pet> => {
  return aptosClient
    .view({
      payload: {
        function: `${NEXT_PUBLIC_CONTRACT_ADDRESS}::main::get_aptogotchi`,
        functionArguments: [address],
      },
    })
    .then((response) => {
      return {
        name: response[0] as string,
        birthday: response[1] as number,
        parts: response[2] as PetParts,
      };
    });
};

export function Connected() {
  const [myPets, setMyPets] = useState<Pet[]>([]);
  const { account, network } = useWallet();

  const fetchMyPets = useCallback(async () => {
    if (!account?.address) return;

    const aptogotchiCollectionAddressResponse = (await aptosClient.view({
      payload: {
        function: `${NEXT_PUBLIC_CONTRACT_ADDRESS}::main::get_aptogotchi_collection_address`,
      },
    })) as [`0x${string}`];

    const collectionAddress = padAddressIfNeeded(
      aptogotchiCollectionAddressResponse[0]
    );

    const myAptogotchisResponse =
      await aptosClient.getAccountOwnedTokensFromCollectionAddress({
        collectionAddress,
        accountAddress: account.address,
      });

    setMyPets(
      await Promise.all(
        myAptogotchisResponse.map((myAptogotchi) =>
          getAptogotchiByAddress(myAptogotchi.token_data_id)
        )
      )
    );
  }, [account?.address]);

  useEffect(() => {
    if (!account?.address || !network) return;

    fetchMyPets();
  }, [account?.address, fetchMyPets, network]);

  return (
    <div className="flex flex-col gap-3 p-3">
      {network?.chainId !== NetworkToChainId[Network.RANDOMNET].toString() && (
        <Modal />
      )}
      <div className="flex flex-row">
        <MyPets pets={myPets} />
        <Mint fetchPet={fetchMyPets} />
      </div>
    </div>
  );
}
