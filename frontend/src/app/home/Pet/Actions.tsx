"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network, Provider } from "aptos";
import { Pet } from ".";
import { getAptosClient } from "@/utils/aptosClient";
import {
  NEXT_PUBLIC_CONTRACT_ADDRESS,
  NEXT_PUBLIC_ENERGY_CAP,
  NEXT_PUBLIC_ENERGY_DECREASE,
  NEXT_PUBLIC_ENERGY_INCREASE,
} from "@/utils/env";

const aptosClient = getAptosClient();

export const provider = new Provider(Network.TESTNET);
export type PetAction = "feed" | "play" | "buy" | "wear" | "unwear";

export interface ActionsProps {
  pet: Pet;
  selectedAction: PetAction;
  setSelectedAction: (action: PetAction) => void;
  setPet: Dispatch<SetStateAction<Pet | undefined>>;
}

export function Actions({
  selectedAction,
  setSelectedAction,
  setPet,
  pet,
}: ActionsProps) {
  const [transactionInProgress, setTransactionInProgress] =
    useState<boolean>(false);
  const { account, network, signAndSubmitTransaction } = useWallet();

  const handleStart = () => {
    switch (selectedAction) {
      case "feed":
        handleFeed();
        break;
      case "play":
        handlePlay();
        break;
      case "buy":
        handleBuy();
        break;
      case "wear":
        handleWear();
        break;
      case "unwear":
        handleUnwear();
        break;
    }
  };

  const handleFeed = async () => {
    if (!account || !network) return;

    setTransactionInProgress(true);
    const payload = {
      type: "entry_function_payload",
      function: `${NEXT_PUBLIC_CONTRACT_ADDRESS}::main::feed`,
      type_arguments: [],
      arguments: [NEXT_PUBLIC_ENERGY_INCREASE],
    };

    try {
      const response = await signAndSubmitTransaction(payload);
      await aptosClient.waitForTransaction({ transactionHash: response.hash });

      setPet((pet) => {
        if (!pet) return pet;
        if (
          pet.energy_points + Number(NEXT_PUBLIC_ENERGY_INCREASE) >
          Number(NEXT_PUBLIC_ENERGY_CAP)
        )
          return pet;

        return {
          ...pet,
          energy_points:
            pet.energy_points + Number(NEXT_PUBLIC_ENERGY_INCREASE),
        };
      });
    } catch (error: any) {
      console.error(error);
    } finally {
      setTransactionInProgress(false);
    }
  };

  const handlePlay = async () => {
    if (!account || !network) return;

    setTransactionInProgress(true);
    const payload = {
      type: "entry_function_payload",
      function: `${NEXT_PUBLIC_CONTRACT_ADDRESS}::main::play`,
      type_arguments: [],
      arguments: [NEXT_PUBLIC_ENERGY_DECREASE],
    };

    try {
      const response = await signAndSubmitTransaction(payload);
      await aptosClient.waitForTransaction({
        transactionHash: response.hash,
      });

      setPet((pet) => {
        if (!pet) return pet;
        if (pet.energy_points <= Number(NEXT_PUBLIC_ENERGY_DECREASE))
          return pet;

        return {
          ...pet,
          energy_points:
            pet.energy_points - Number(NEXT_PUBLIC_ENERGY_DECREASE),
        };
      });
    } catch (error: any) {
      console.error(error);
    } finally {
      setTransactionInProgress(false);
    }
  };

  const handleBuy = async () => {
    if (!account || !network) return;

    setTransactionInProgress(true);
    const payload = {
      type: "entry_function_payload",
      function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::main::create_accessory`,
      type_arguments: [],
      arguments: ["bowtie"],
    };

    try {
      // show accessory in inventory
      const response = await signAndSubmitTransaction(payload);
      await provider.waitForTransaction(response.hash);
    } catch (error: any) {
      console.error(error);
    } finally {
      setTransactionInProgress(false);
    }
  };
  const handleWear = async () => {
    if (!account || !network) return;

    setTransactionInProgress(true);

    const payload = {
      type: "entry_function_payload",
      function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::main::wear_accessory`,
      type_arguments: [],
      arguments: ["bowtie"],
    };

    try {
      const response = await signAndSubmitTransaction(payload);
      await provider.waitForTransaction(response.hash);

      setPet((pet) => {
        if (!pet) return pet;
        return {
          ...pet,
          accessories: "bowtie",
        };
      });
    } catch (error: any) {
      console.error(error);
    } finally {
      setTransactionInProgress(false);
    }
  };
  const handleUnwear = async () => {
    if (!account || !network) return;

    setTransactionInProgress(true);

    const payload = {
      type: "entry_function_payload",
      function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::main::unwear_accessory`,
      type_arguments: [],
      arguments: ["bowtie"],
    };

    try {
      const response = await signAndSubmitTransaction(payload);
      await provider.waitForTransaction(response.hash);

      setPet((pet) => {
        if (!pet) return pet;
        return {
          ...pet,
          accessories: null,
        };
      });
    } catch (error: any) {
      console.error(error);
    } finally {
      setTransactionInProgress(false);
    }
  };

  const feedDisabled =
    selectedAction === "feed" &&
    pet.energy_points === Number(NEXT_PUBLIC_ENERGY_CAP);
  const playDisabled =
    selectedAction === "play" && pet.energy_points === Number(0);
  const wearDisabled = selectedAction === "wear" && pet.accessories;
  const unwearDisabled = selectedAction === "unwear" && pet.accessories == null;

  return (
    <div className="nes-container with-title flex-1 bg-white h-[320px]">
      <p className="title">Actions</p>
      <div className="flex flex-col gap-2 justify-between h-full">
        <div className="flex flex-col flex-shrink-0 gap-2 border-b border-gray-300">
          <label>
            <input
              type="radio"
              className="nes-radio"
              name="action"
              checked={selectedAction === "play"}
              onChange={() => setSelectedAction("play")}
            />
            <span>Play</span>
          </label>
          <label>
            <input
              type="radio"
              className="nes-radio"
              name="action"
              checked={selectedAction === "feed"}
              onChange={() => setSelectedAction("feed")}
            />
            <span>Feed</span>
          </label>
          <label>
            <input
              type="radio"
              className="nes-radio"
              name="action"
              checked={selectedAction === "buy"}
              onChange={() => setSelectedAction("buy")}
            />
            <span>Buy Accessory</span>
          </label>
          <label>
            <input
              type="radio"
              className="nes-radio"
              name="action"
              checked={selectedAction === "wear"}
              onChange={() => setSelectedAction("wear")}
            />
            <span>Wear</span>
          </label>
          <label>
            <input
              type="radio"
              className="nes-radio"
              name="action"
              checked={selectedAction === "unwear"}
              onChange={() => setSelectedAction("unwear")}
            />
            <span>Unwear</span>
          </label>
        </div>
        <div className="flex flex-col gap-4 justify-between">
          <p>{actionDescriptions[selectedAction]}</p>
          <button
            type="button"
            className={`nes-btn is-success ${
              feedDisabled || playDisabled || wearDisabled || unwearDisabled
                ? "is-disabled"
                : ""
            }`}
            onClick={handleStart}
            disabled={
              transactionInProgress ||
              feedDisabled ||
              playDisabled ||
              wearDisabled
            }
          >
            {transactionInProgress ? "Processing..." : "Start"}
          </button>
        </div>
      </div>
    </div>
  );
}

const actionDescriptions: Record<PetAction, string> = {
  feed: "Feeding your pet will boost its Energy Points...",
  play: "Playing with your pet will make it happy and consume its Energy Points...",
  buy: "Buy an accessory for your pet...",
  wear: "Wear an accessory for your pet...",
  unwear: "Take off an accessory for your pet...",
};
