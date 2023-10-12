"use client";

import { AiFillSave } from "react-icons/ai";
import { HealthBar } from "@/components/HealthBar";
import { Pet } from ".";
import { Dispatch, SetStateAction, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network, Provider } from "aptos";
import { AptosNamesConnector } from "@aptos-labs/aptos-names-connector";
import "@aptos-labs/aptos-names-connector/dist/index.css";

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
  const [owner, setOwner] = useState<string>(
    account?.ansName || account?.address || ""
  );

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

  const handleMintName = async (payload: any): Promise<any> => {
    try {
      const response = await signAndSubmitTransaction(payload);
      await provider.waitForTransaction(response.hash);

      setOwner(response.payload.arguments[0]);
    } catch (error: any) {
      console.error(error);
    } finally {
      setTransactionInProgress(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col">
        <label>HP</label>
        <HealthBar
          totalHealth={10}
          currentHealth={pet.health_points}
          icon="heart"
        />
        <label>Happiness</label>
        <HealthBar totalHealth={10} currentHealth={pet.happiness} icon="star" />
      </div>
      <div className="flex flex-col gap-2">
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
        <div className="nes-field">
          <label htmlFor="owner_field">Owner</label>
          <input
            type="text"
            id="owner_field"
            className="nes-input"
            disabled
            value={`${owner}.apt`}
          />
        </div>
        <br />
        {!account?.ansName && (
          <button type="button" className="nes-btn is-primary ans_button">
            <span style={{ zIndex: 9 }}>
              <AptosNamesConnector
                onSignTransaction={handleMintName}
                isWalletConnected={true}
                network="testnet"
                buttonLabel="Claim Your Aptos Name"
              />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
