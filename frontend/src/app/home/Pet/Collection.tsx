"use client";

import { Pet } from ".";
import { useCallback, useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network, Provider } from "aptos";

export const provider = new Provider(Network.TESTNET);

export interface CollectionProps {
  pet: Pet;
}

export type Collection = {
  collection_id: string;
  collection_name: string;
  creator_address: string;
  uri: string;
  current_supply: any;
};

export function Collection({ pet }: CollectionProps) {
  const { account, network } = useWallet();
  const [collection, setCollection] = useState<Collection>();
  const [collectionHolders, setCollectionHolders] = useState<string[]>();

  const fetchCollection = useCallback(async () => {
    if (!account?.address) return;

    const tokenDataResponse = await provider.getTokenData(pet.address, {
      tokenStandard: "v2",
    });

    const collectionResponse =
      tokenDataResponse?.current_token_datas_v2[0].current_collection!;

    const getAllCollectionHoldersGql = {
      query: `
        query MyQuery($collection_id: String) {
          current_collection_ownership_v2_view(
            where: { collection_id: { _eq: $collection_id } }
          ) {
            owner_address
          }
        }
      `,
      variables: {
        collection_id: collectionResponse.collection_id,
      },
    };
    const collectionHolderResponse = await provider.indexerClient.queryIndexer(
      getAllCollectionHoldersGql
    );

    console.log(JSON.stringify(tokenDataResponse, null, 2));
    console.log(
      JSON.stringify(
        // @ts-ignore
        collectionHolderResponse.current_collection_ownership_v2_view,
        null,
        2
      )
    );

    setCollection({
      collection_id: collectionResponse.collection_id,
      collection_name: collectionResponse.collection_name,
      creator_address: collectionResponse.creator_address,
      uri: collectionResponse.uri,
      current_supply: collectionResponse.current_supply,
    });

    setCollectionHolders(
      // @ts-ignore
      collectionHolderResponse.current_collection_ownership_v2_view.map(
        // @ts-ignore
        (d) => d.owner_address
      )
    );
  }, [account?.address]);

  useEffect(() => {
    if (!account?.address || !network) return;

    fetchCollection();
  }, [account?.address, fetchCollection, network]);

  const collectionComponent = (
    <div className="nes-field">
      <label htmlFor="owner_field">
        Aptogotchi Minted: {collection?.current_supply}
      </label>
      <label htmlFor="owner_field">All Holders</label>
      <ul className="nes-list is-disc">
        <label>
          {JSON.stringify(
            collectionHolders?.map((holder) => holder.substring(0, 5) + "...")
          )}
        </label>
      </ul>
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">{collectionComponent}</div>
    </div>
  );
}
