import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network, Provider } from "aptos";
import { PetImage, bodies, ears, faces } from "../Pet/Image";
import { Pet } from "../Pet";

export const provider = new Provider(Network.DEVNET);

export interface MintProps {
  fetchPet: () => Promise<void>;
}

const defaultPet: Pet = {
  name: "Unknown",
  health_points: 0,
  happiness: 0,
  parts: [],
};

export function Mint({ fetchPet }: MintProps) {
  const [newName, setNewName] = useState("");
  const [parts, setParts] = useState([bodies[0], ears[0], faces[0]]);

  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const { account, network, signAndSubmitTransaction } = useWallet();

  const handleMint = async () => {
    if (!account || !network) return;

    setTransactionInProgress(true);
    const payload = {
      type: "entry_function_payload",
      function: `${process.env.NEXT_PUBLIC_REACT_APP_CONTRACT_ADDRESS}::main::create_aptogotchi`,
      type_arguments: [],
      arguments: [newName, parts],
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

  function createPetImage(body: string, ear: string, face: string) {
    return (
      <div
        onClick={() => setParts([body, ear, face])}
        className={
          JSON.stringify(parts) == JSON.stringify([body, ear, face])
            ? "selected"
            : ""
        }
      >
        <PetImage
          pet={defaultPet}
          selectedAction={"feed"}
          petParts={{
            body: body,
            ears: ear,
            face: face,
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-md self-center pt-8">
      <h2 className="text-xl pb-4">Create your pet!</h2>
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
      <div className="flex flex-col gap-6 self-center">
        {createPetImage(bodies[0], ears[0], faces[0])}
        {createPetImage(bodies[1], ears[1], faces[1])}
        {createPetImage(bodies[2], ears[2], faces[2])}
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
