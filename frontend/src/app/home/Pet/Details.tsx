"use client";

import { AiFillSave } from "react-icons/ai";
import { FaCopy, FaExternalLinkAlt } from "react-icons/fa";
import { HealthBar } from "@/components/HealthBar";
import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { getAptosClient } from "@/utils/aptosClient";
import { ABI } from "@/utils/abi";
import { toast } from "sonner";
import { usePet } from "@/context/PetContext";

const aptosClient = getAptosClient();

export function PetDetails() {
  const { pet, setPet } = usePet();

  const [newName, setNewName] = useState<string>(pet?.name || "");
  const { account, network, signAndSubmitTransaction } = useWallet();
  const owner = account?.ansName
    ? `${account?.ansName}.apt`
    : account?.address || "";

  const canSave = newName !== pet?.name;

  const handleNameChange = async () => {
    if (!account || !network) return;

    try {
      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${ABI.address}::main::set_name`,
          typeArguments: [],
          functionArguments: [newName],
        },
      });
      await aptosClient.waitForTransaction({ transactionHash: response.hash });

      setPet((pet) => {
        if (!pet) return pet;
        return { ...pet, name: newName };
      });
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to update name. Please try again.");
    } finally {
      toast.success(
        `Name was successfully updated from ${pet?.name} to ${newName}!`
      );
    }
  };

  const handleCopyOwnerAddrOrName = () => {
    navigator.clipboard.writeText(owner);
    toast.success("Owner address copied to clipboard.");
  };

  const nameFieldComponent = (
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
  );

  const ownerFieldComponent = (
    <div className="nes-field">
      <a
        className="flex items-center gap-2"
        href={`https://explorer.aptoslabs.com/account/${owner}?network=testnet`}
        target="_blank"
      >
        <label htmlFor="owner_field" className="mb-0">
          Owner
        </label>
        <FaExternalLinkAlt className="h-4 w-4 drop-shadow-sm" />
      </a>
      <div className="relative">
        <input
          type="text"
          id="owner_field"
          className="nes-input pr-12"
          disabled
          value={owner}
        />
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 nes-pointer disabled:cursor-not-allowed text-gray-400 disabled:text-gray-400"
          onClick={handleCopyOwnerAddrOrName}
        >
          <FaCopy className="h-8 w-8 drop-shadow-sm" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col">
        <label>Energy Points</label>
        <HealthBar
          totalHealth={10}
          currentHealth={pet?.energy_points || 0}
          icon="star"
        />
      </div>
      <div className="flex flex-col gap-2">
        {nameFieldComponent}
        {ownerFieldComponent}
        <br />
      </div>
    </div>
  );
}
