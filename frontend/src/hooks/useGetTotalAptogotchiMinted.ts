import { useCallback, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { getAptosClient } from "@/utils/aptosClient";
import { NEXT_PUBLIC_CONTRACT_ADDRESS } from "@/utils/env";
import { padAddressIfNeeded } from "@/utils/address";
import { Pet, PetParts } from "@/app/home/Pet";

const aptosClient = getAptosClient();

export function useGetTotalAptogotchiMinted() {
  const { account } = useWallet();
  const [totalMinted, setTotalMinted] = useState<number>();
  const [loading, setLoading] = useState(false);

  const fetchCollection = useCallback(async () => {
    if (!account?.address) return;

    try {
      setLoading(true);

      const aptogotchiCollectionIDResponse = (await aptosClient.view({
        payload: {
          function: `${NEXT_PUBLIC_CONTRACT_ADDRESS}::main::get_aptogotchi_collection_id`,
        },
      })) as [`0x${string}`];

      const aptogotchiCollectionNameResponse = (await aptosClient.view({
        payload: {
          function: `${NEXT_PUBLIC_CONTRACT_ADDRESS}::main::get_aptogotchi_collection_name`,
        },
      })) as [string];

      const aptogotchiCollectionCreatorAddressResponse =
        (await aptosClient.view({
          payload: {
            function: `${NEXT_PUBLIC_CONTRACT_ADDRESS}::main::get_aptogotchi_collection_id`,
          },
        })) as [`0x${string}`];

      const collectionIDAddr = padAddressIfNeeded(
        aptogotchiCollectionIDResponse[0]
      );
      const collectionName = aptogotchiCollectionNameResponse[0];
      const collectionCreatorAddress = padAddressIfNeeded(
        aptogotchiCollectionCreatorAddressResponse[0]
      );

      const myAptogotchisResponse = await aptosClient.getCollectionData({
        creatorAddress: collectionCreatorAddress,
        collectionName,
      });

      setTotalMinted(myAptogotchisResponse.max_supply);
    } catch (error) {
      console.error("Error fetching Aptogotchi collection:", error);
    } finally {
      setLoading(false);
    }
  }, [account?.address]);

  return { totalMinted, loading, fetchCollection };
}
