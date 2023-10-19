"use client";

import { useCallback, useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network, Provider } from "aptos";

export const provider = new Provider(Network.TESTNET);

export interface CollectionProps {
  collectionID: string;
}

export type Collection = {
  collection_id: string;
  collection_name: string;
  creator_address: string;
  uri: string;
  current_supply: any;
};

export type CollectionHolder = {
  owner_address: string;
};

export function Collection({ collectionID }: CollectionProps) {
  const { account, network } = useWallet();
  const [collection, setCollection] = useState<Collection>();
  const [collectionHolders, setCollectionHolders] =
    useState<CollectionHolder[]>();

  const fetchCollection = useCallback(async () => {
    if (!account?.address) return;

    const getCollectionDataGql = {
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
        collection_id: collectionID,
      },
    };

    // const tokenDataResponse = await provider.

    const collectionResponse = await provider.indexerClient.queryIndexer(
      getCollectionDataGql
    );

    // const getAllCollectionHoldersGql = {
    //   query: `
    //     query MyQuery($collection_id: String) {
    //       current_collection_ownership_v2_view(
    //         where: { collection_id: { _eq: $collection_id } }
    //       ) {
    //         owner_address
    //       }
    //     }
    //   `,
    //   variables: {
    //     collection_id: collectionID,
    //   },
    // };
    // const collectionHolderResponse = await provider.indexerClient.queryIndexer(
    //   getAllCollectionHoldersGql
    // );

    console.log(JSON.stringify(collectionResponse, null, 2));
    // console.log(
    //   JSON.stringify(
    //     // @ts-ignore
    //     collectionHolderResponse,
    //     null,
    //     2
    //   )
    // );

    //   setCollection(collectionResponse);

    //   setCollectionHolders(
    //     collectionHolderResponse
    //     // // @ts-ignore
    //     // collectionHolderResponse.current_collection_ownership_v2_view.map(
    //     //   // @ts-ignore
    //     //   (d) => d.owner_address
    //     // )
    //   );
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
            collectionHolders?.map(
              (holder) => holder.owner_address.substring(0, 5) + "..."
            )
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
