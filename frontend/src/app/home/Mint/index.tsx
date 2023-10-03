import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network, Provider } from "aptos";
import { PetImage, bodies, ears, faces } from "../Pet/Image";
import { Pet } from "../Pet";
import { PiShuffleAngularFill } from "react-icons/pi";

export const provider = new Provider(Network.TESTNET);

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
  const [newName, setNewName] = useState<string>("");
  const [parts, setParts] = useState<number[]>([0, 0, 0]);
  const [selectedAction, setSelectedAction] = useState<"feed" | "play">("feed");
  const [transactionInProgress, setTransactionInProgress] =
    useState<boolean>(false);

  const { account, network, signAndSubmitTransaction } = useWallet();

  const handleShuffle = () => {
    const randomParts = [
      Math.floor(Math.random() * Number(process.env.NEXT_PUBLIC_BODY_OPTIONS)),
      Math.floor(Math.random() * Number(process.env.NEXT_PUBLIC_EAR_OPTIONS)),
      Math.floor(Math.random() * Number(process.env.NEXT_PUBLIC_FACE_OPTIONS)),
    ];
    setParts(randomParts);

    const actions = ["feed", "play"];
    const randomAction = actions[Math.floor(Math.random() * actions.length)] as
      | "feed"
      | "play";
    setSelectedAction(randomAction);
  };

  const handleMint = async () => {
    if (!account || !network) return;

    setTransactionInProgress(true);
    const payload = {
      type: "entry_function_payload",
      function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::main::create_aptogotchi`,
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

  function createPetImage([body, ear, face]: number[]) {
    return (
      <div onClick={() => setParts([body, ear, face])}>
        <PetImage
          pet={defaultPet}
          selectedAction={selectedAction}
          petParts={{
            body: bodies[body],
            ears: ears[ear],
            face: faces[face],
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
        {createPetImage(parts)}
        <button
          type="button"
          className="nes-btn flex flex-row justify-center items-center"
          onClick={handleShuffle}
        >
          <h2>Shuffle</h2>
          <PiShuffleAngularFill className="h-8 w-8 drop-shadow-sm ml-2" />
        </button>
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
