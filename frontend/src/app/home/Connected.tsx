"use client";

import { useEffect, useCallback } from "react";
import { Pet } from "./Pet";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Mint } from "./Mint";
import { getAptosClient } from "@/utils/aptosClient";
import { Modal } from "@/components/Modal";
import { ABI } from "@/utils/abi";
import { usePet } from "@/context/PetContext";

/**
 * getAptosClient is a helper to ensure we're only creating the client once. In practice, this is what it does: 
 * ```
 * const config = new AptosConfig({ network: Network.TESTNET });
 * return new Aptos(config);
 * ```
 */
const aptosClient = getAptosClient();

export function Connected() {
  // These are attributes tied to our Aptogotchi
  const { pet, setPet } = usePet();
  // The currently connected account and network let us know where to look for on-chain data
  const { account, network } = useWallet();

  const fetchPet = useCallback(async () => {
    // We need to know which account owns the Aptogotchi we're interested in.
    if (!account?.address) return;

    /**
     * `aptosClient.view` calls a view function to look up data from our contract
     * 
     * The syntax for calling a function on-chain is:
     * address::module_name::function_name
     * 
     * `ABI.address` is the address we deployed our version of the Aptogotchi contract to.
     * `account.address` is the address which potentially owns an Aptogotchi.
     */
    const hasPet = await aptosClient.view({
      payload: {
        function: `${ABI.address}::main::has_aptogotchi`,
        functionArguments: [account.address],
      },
    });

    if (hasPet) {
      let response;

      try {
        // Next we try to find all the "part" resources that make up the Aptogotchi
        response = await aptosClient.view({
          payload: {
            function: `${ABI.address}::main::get_aptogotchi`,
            functionArguments: [account.address],
          },
        });

        const [name, birthday, energyPoints, parts] = response;

        // Move functions return Move types, so we have to cast each response type into its respective type
        const typedParts = parts as { body: number; ear: number; face: number };
        setPet({
          name: name as string,
          birthday: birthday as number,
          energy_points: energyPoints as number,
          parts: typedParts,
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, [account?.address]);

  useEffect(() => {
    if (!account?.address || !network) return;

    fetchPet();
  }, [account?.address, fetchPet, network]);

  const TESTNET_ID = "2";

  // Currently Aptogotchi only works on Testnet, so we display a modal for them to select Testnet.
  // If this user has an Aptogotchi already, we display it using the information from the above logic.
  // Otherwise we give users the option to mint a new Aptogotchi.
  return (
    <div className="flex flex-col gap-3 p-3">
      {network?.chainId !== TESTNET_ID && <Modal />}
      {pet ? <Pet /> : <Mint fetchPet={fetchPet} />}
    </div>
  );
}
