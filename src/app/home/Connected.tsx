"use client";

import { useState, useEffect } from "react";
import { Pet } from "./Pet";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network, Provider } from "aptos";
import { Mint } from "./Mint";

export const provider = new Provider(Network.DEVNET);

export function Connected() {
  const [pet, setPet] = useState<Pet>();
  const [isLoading, setIsLoading] = useState(true);
  const { account, network } = useWallet();

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
      if (JSON.stringify(response) !== JSON.stringify(noPet)) {
        // get and set pet data from user's wallet
        setPet({
          name: response[0] as unknown as string,
          health_points: response[2] as unknown as number,
          happiness: response[3] as unknown as number,
        });
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // TODO: Design a nice loading screen
  if (isLoading) return null;

  return (
    <div className="flex flex-col gap-3 p-3">
      {pet ? <Pet pet={pet} /> : <Mint />}
    </div>
  );
}
