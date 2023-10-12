"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network, Provider } from "aptos";
import { Pet } from ".";

export const provider = new Provider(Network.TESTNET);
export type PetAction = "feed" | "play" | "customize";

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
    }
  };

  const handleFeed = async () => {
    if (!account || !network) return;

    setTransactionInProgress(true);
    const payload = {
      type: "entry_function_payload",
      function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::main::change_health_points`,
      type_arguments: [],
      arguments: [account.address, process.env.NEXT_PUBLIC_HEALTH_INCREASE],
    };

    try {
      const response = await signAndSubmitTransaction(payload);
      await provider.waitForTransaction(response.hash);

      setPet((pet) => {
        if (!pet) return pet;
        return {
          ...pet,
          health_points:
            pet.health_points +
              Number(process.env.NEXT_PUBLIC_HEALTH_INCREASE) >
            Number(process.env.NEXT_PUBLIC_HEALTH_CAP)
              ? Number(process.env.NEXT_PUBLIC_HEALTH_CAP)
              : pet.health_points +
                Number(process.env.NEXT_PUBLIC_HEALTH_INCREASE),
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
      function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::main::change_happiness`,
      type_arguments: [],
      arguments: [account.address, process.env.NEXT_PUBLIC_HAPPINESS_INCREASE],
    };

    try {
      const response = await signAndSubmitTransaction(payload);
      await provider.waitForTransaction(response.hash);

      setPet((pet) => {
        if (!pet) return pet;
        return {
          ...pet,
          happiness:
            pet.happiness + Number(process.env.NEXT_PUBLIC_HAPPINESS_INCREASE) >
            Number(process.env.NEXT_PUBLIC_HAPPINESS_CAP)
              ? Number(process.env.NEXT_PUBLIC_HAPPINESS_CAP)
              : pet.happiness +
                Number(process.env.NEXT_PUBLIC_HAPPINESS_INCREASE),
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
    pet.health_points === Number(process.env.NEXT_PUBLIC_HEALTH_CAP);
  const playDisabled =
    selectedAction === "play" &&
    pet.happiness === Number(process.env.NEXT_PUBLIC_HAPPINESS_CAP);

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
        </div>
        <div className="flex flex-col gap-4 justify-between">
          <p>{actionDescriptions[selectedAction]}</p>
          <button
            type="button"
            className={`nes-btn is-success ${
              feedDisabled || playDisabled ? "is-disabled" : ""
            }`}
            onClick={handleStart}
            disabled={transactionInProgress || feedDisabled || playDisabled}
          >
            {transactionInProgress ? "Processing..." : "Start"}
          </button>
        </div>
      </div>
    </div>
  );
}

const actionDescriptions: Record<PetAction, string> = {
  feed: "Feeding your pet will boost its HP and Happiness...",
  play: "Playing with your pet will boost its Happiness, but deplete some of its HP...",
  customize:
    "Customize your pet to give it a fresh new look and make it truly yours...",
};
