"use client";

import { useState, useEffect } from "react";
import { Pet } from "./Pet";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network, Provider } from "aptos";

export const provider = new Provider(Network.TESTNET);

export function Connected() {
  const [pet, setPet] = useState<Pet>({
    name: "Bob",
    health_points: 10,
    happiness: 10,
  });
  const [hasPet, setHasPet] = useState<boolean>(false); // TODO: check if pet exists in user's wallet
  const { account, network, signAndSubmitTransaction } = useWallet();

  useEffect(() => {
    if (!account || !network) return;

    const fetchData = async () => {
      // if no pet exists, show minting component
      // build a transaction payload to be submitted
      const payload = {
        type: "entry_function_payload",
        function:
          "0x71cc7f10ea20de366f1d512369df023e607fe14261e815c289eec8dc6b3ea7fe::main::get_aptogotchi",
        type_arguments: [],
        arguments: [account.address],
      };

      try {
        // sign and submit transaction to chain
        const response = await signAndSubmitTransaction(payload);
        const noPet = ["", 0, 0, 0];

        console.log("response: ", response);

        if (response !== noPet) {
          // get and set pet data from user's wallet
          setPet({
            name: "Bob",
            health_points: 10,
            happiness: 10,
          });
        }

        // wait for transaction
        await provider.waitForTransaction(response.hash);
      } catch (error: any) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-3 p-3">
      <Pet pet={pet} />
    </div>
  );
}
