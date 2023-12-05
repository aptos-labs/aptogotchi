import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { ShufflePetImage } from "../Pet/ShufflePetImage";
import { NEXT_PUBLIC_CONTRACT_ADDRESS } from "@/utils/env";
import { getAptosClient } from "@/utils/aptosClient";

const aptosClient = getAptosClient();

export interface MintProps {
  fetchPet: () => Promise<void>;
}

export function Mint({ fetchPet }: MintProps) {
  const [newName, setNewName] = useState<string>("");
  const [petParts, setPetParts] = useState<number[]>([0, 0, 0]);

  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);

  const { account, network, signAndSubmitTransaction } = useWallet();

  const handleMint = async () => {
    if (!account || !network) return;

    setTransactionInProgress(true);
    const payload = {
      type: "entry_function_payload",
      function: `${NEXT_PUBLIC_CONTRACT_ADDRESS}::main::create_aptogotchi`,
      type_arguments: [],
      arguments: [newName, petParts],
    };

    try {
      const response = await signAndSubmitTransaction(payload);
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
      <div className="nes-field w-[320px]">
        <label htmlFor="name_field">Name</label>
        <input
          type="text"
          id="name_field"
          className="nes-input"
          value={newName}
          onChange={(e) => setNewName(e.currentTarget.value)}
        />
      </div>
      <ShufflePetImage petParts={petParts} setPetParts={setPetParts} />
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
