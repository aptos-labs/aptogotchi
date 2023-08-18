"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network, Provider } from "aptos";
import { Pet } from ".";

export const provider = new Provider(Network.DEVNET);

export type PetAction = "feed" | "play" | "customize";

export interface ActionsProps {
  selectedAction: PetAction;
  setSelectedAction: (action: PetAction) => void;
  setPet: Dispatch<SetStateAction<Pet | undefined>>;
}

export function Actions({
  selectedAction,
  setSelectedAction,
  setPet,
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
      case "customize":
        break;
    }
  };

  const handleFeed = async () => {
    if (!account || !network) return;

    setTransactionInProgress(true);
    // build a transaction payload to be submitted
    const payload = {
      type: "entry_function_payload",
      function:
        "0xe8a7346fd49d2aeaa1ddd1c58c865eeb617c4f88870c8b0a25cfae2938eb5574::main::change_health_points",
      type_arguments: [],
      arguments: [account.address, 2],
    };

    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
      setPet((pet) => {
        if (!pet) return pet;
        return { ...pet, health_points: pet.health_points + 1 };
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
    // build a transaction payload to be submitted
    const payload = {
      type: "entry_function_payload",
      function:
        "0xe8a7346fd49d2aeaa1ddd1c58c865eeb617c4f88870c8b0a25cfae2938eb5574::main::change_happiness",
      type_arguments: [],
      arguments: [account.address, 2],
    };

    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
      setPet((pet) => {
        if (!pet) return pet;
        return { ...pet, happiness: pet.happiness + 1 };
      });
    } catch (error: any) {
      console.error(error);
    } finally {
      setTransactionInProgress(false);
    }
  };

  return (
    <div className="nes-container with-title flex-1 bg-white">
      <p className="title">Actions</p>
      <div className="flex gap-12 justify-between h-full">
        <div className="flex flex-col flex-shrink-0 gap-1">
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
              checked={selectedAction === "customize"}
              onChange={() => setSelectedAction("customize")}
            />
            <span>Customize</span>
          </label>
        </div>
        <div className="w-1 h-full bg-zinc-300 flex-shrink-0" />
        <div className="flex flex-col gap-1 justify-between">
          <p>{actionDescriptions[selectedAction]}</p>
          <button
            type="button"
            className="nes-btn is-success"
            onClick={handleStart}
            disabled={transactionInProgress}
          >
            {transactionInProgress ? "Processing..." : "Start"}
          </button>
        </div>
      </div>
    </div>
  );
}

const actionDescriptions: Record<PetAction, string> = {
  feed: "Feeding your pet will boost its HP and Happiness stats...",
  play: "Playing with your pet will greatly boost its Happiness stat but deplete some of its HP...",
  customize:
    "Customize your pet to give it a fresh new look and truly make it yours...",
};
