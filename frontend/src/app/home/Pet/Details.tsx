"use client";

import { AiFillSave } from "react-icons/ai";
import { HealthBar } from "@/components/HealthBar";
import { Pet } from ".";
import { Dispatch, SetStateAction, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network, Provider } from "aptos";

export interface PetDetailsProps {
  pet: Pet;
  setPet: Dispatch<SetStateAction<Pet | undefined>>;
}

export const provider = new Provider(Network.TESTNET);

export function PetDetails({ pet, setPet }: PetDetailsProps) {
  const [newName, setNewName] = useState(pet.name);
  const [transactionInProgress, setTransactionInProgress] =
    useState<boolean>(false);
  const { account, network, signAndSubmitTransaction } = useWallet();

  const canSave = newName !== pet.name;

  const handleNameChange = async () => {
    if (!account || !network) return;

    setTransactionInProgress(true);
    const payload = {
      type: "entry_function_payload",
      function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::main::set_name`,
      type_arguments: [],
      arguments: [account.address, newName],
    };

    try {
      const response = await signAndSubmitTransaction(payload);
      await provider.waitForTransaction(response.hash);

      setPet((pet) => {
        if (!pet) return pet;
        return { ...pet, name: newName };
      });
    } catch (error: any) {
      console.error(error);
    } finally {
      setTransactionInProgress(false);
    }
  };

  return (
    <div className="flex flex-row gap-4 ml-4">
      <div className="flex flex-col w-6/12">
        <div className="nes-field">
          <label htmlFor="name_field">Name</label>
          <div className="relative">
            <input
              type="text"
              id="name_field"
              className="nes-input"
              value={newName}
              onChange={(e) => setNewName(e.currentTarget.value)}
            />
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 nes-pointer disabled:cursor-not-allowed text-sky-500 disabled:text-gray-400"
              disabled={!canSave}
              onClick={handleNameChange}
            >
              <AiFillSave className=" h-8 w-8 drop-shadow-sm" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-6/12">
        <label>HP</label>
        <HealthBar
          totalHealth={10}
          currentHealth={pet.health_points}
          icon="heart"
        />
        <label>Happiness</label>
        <HealthBar totalHealth={10} currentHealth={pet.happiness} icon="star" />
      </div>
    </div>
  );
}
