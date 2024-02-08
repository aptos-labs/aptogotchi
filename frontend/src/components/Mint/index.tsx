import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { NEXT_PUBLIC_CONTRACT_ADDRESS } from "@/utils/env";
import { getAptosClient } from "@/utils/aptosClient";
import { MysteryBoxImage } from "@/components/Pet/Image";

const aptosClient = getAptosClient();

export interface MintProps {
  fetchPet: () => Promise<void>;
}

export function Mint({ fetchPet }: MintProps) {
  const [newName, setNewName] = useState<string>("");
  const [transactionInProgress, setTransactionInProgress] =
    useState<boolean>(false);

  const { account, network, signAndSubmitTransaction } = useWallet();

  const handleMint = async () => {
    if (!account || !network) return;

    setTransactionInProgress(true);

    try {
      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${NEXT_PUBLIC_CONTRACT_ADDRESS}::main::create_aptogotchi`,
          typeArguments: [],
          functionArguments: [newName],
        },
      });
      await aptosClient.waitForTransaction({
        transactionHash: response.hash,
      });
    } catch (error: any) {
      console.error(error);
    } finally {
      fetchPet();
      setTransactionInProgress(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-md self-center m-4">
      <h2 className="text-xl w-full text-center">Create your pet!</h2>
      <p className="w-full text-center">
        We leverage on chain randomness to create a random look aptogotchi!
      </p>
      <div className="nes-field w-full max-w-xs mx-auto">
        <label htmlFor="name_field">Name</label>
        <input
          type="text"
          id="name_field"
          className="nes-input"
          value={newName}
          onChange={(e) => setNewName(e.currentTarget.value)}
        />
      </div>
      <MysteryBoxImage />
      <button
        type="button"
        className={`nes-btn ${newName ? "is-success" : "is-disabled"}`}
        disabled={!newName || transactionInProgress}
        onClick={handleMint}
      >
        {transactionInProgress ? "Loading..." : "Mint Pet"}
      </button>
      <br />
    </div>
  );
}
