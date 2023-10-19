"use client";

import { useCallback, useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network, Provider } from "aptos";
import { padAddressIfNeeded } from "@/utils/address";

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

export type CollectionResponse = {
  current_collections_v2: Collection[];
  current_collection_ownership_v2_view: CollectionHolder[];
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
          current_collections_v2(
            where: { collection_id: { _eq: $collection_id } }
          ) {
            collection_id
            collection_name
            current_supply
            description
            creator_address
            last_transaction_timestamp
            max_supply
            last_transaction_version
            mutable_description
            mutable_uri
            token_standard
            table_handle_v1
            total_minted_v2
            uri
          }
          current_collection_ownership_v2_view(
            where: { collection_id: { _eq: $collection_id } }
          ) {
            owner_address
          }
        }
      `,
      variables: {
        collection_id: padAddressIfNeeded(collectionID),
      },
    };

    const collectionResponse: CollectionResponse =
      await provider.indexerClient.queryIndexer(getCollectionDataGql);

    setCollection(collectionResponse.current_collections_v2[0]);
    setCollectionHolders(
      collectionResponse.current_collection_ownership_v2_view
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
