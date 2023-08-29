import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network, Provider } from "aptos";

export const provider = new Provider(Network.DEVNET);

export interface MintProps {
  fetchPet: () => Promise<void>;
}

export function Mint({ fetchPet }: MintProps) {
  const [newName, setNewName] = useState("");
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const { account, network, signAndSubmitTransaction } = useWallet();

  const handleMint = async () => {
    if (!account || !network) return;

    setTransactionInProgress(true);
    const payload = {
      type: "entry_function_payload",
      function:
        "0xb230322f28966237ee14b9d764f230b8ad9382653331ebb419d2909ea817a07f::main::create_aptogotchi",
      type_arguments: [],
      arguments: [newName],
    };

    try {
      const response = await signAndSubmitTransaction(payload);
      await provider.waitForTransaction(response.hash);
    } catch (error: any) {
      console.error(error);
    } finally {
      fetchPet();
      setTransactionInProgress(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-md self-center pt-8">
      <h2 className="text-xl pb-4">Tell us about your pet!</h2>
      <div className="nes-field">
        <label htmlFor="name_field">Name</label>
        <input
          type="text"
          id="name_field"
          className="nes-input"
          value={newName}
          onChange={(e) => setNewName(e.currentTarget.value)}
        />
      </div>
      <button
        type="button"
        className={`nes-btn ${newName ? "is-success" : "is-disabled"}`}
        disabled={!newName || transactionInProgress}
        onClick={handleMint}
      >
        {transactionInProgress ? "Loading..." : "Mint Pet"}
      </button>
    </div>
  );
}
