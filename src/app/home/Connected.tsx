"use client";

import { useState, useEffect } from "react";
import { Pet } from "./Pet";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network, Provider } from "aptos";

export const provider = new Provider(Network.DEVNET);

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
      // build a transaction payload to be submitted
      const payload = {
        function:
          "0x71cc7f10ea20de366f1d512369df023e607fe14261e815c289eec8dc6b3ea7fe::main::get_aptogotchi",
        type_arguments: [],
        arguments: [account.address],
      };

      const response = await provider.view(payload);
      const noPet = ["", "0", 0, 0];

      // if no pet exists, show minting component
      if (response !== noPet) {
        // get and set pet data from user's wallet
        const name: string = response[0];
        const health_points: number = parseInt(response[2]);
        const happiness: number = parseInt(response[3]);
        setPet({
          name: name,
          health_points: health_points,
          happiness: happiness,
        });
        setHasPet(true);
      } else {
        setHasPet(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-3 p-3">
      {hasPet ? <Pet pet={pet} /> : <>mint component</>}
    </div>
  );
}
