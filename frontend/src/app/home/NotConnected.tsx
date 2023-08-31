"use client";

import React, { useState } from "react";
import { useTypingEffect } from "@/utils/useTypingEffect";
import { Pet } from "./Pet";
import { PetImage, bodies, ears, faces } from "./Pet/Image";
import { PiShuffleAngularFill } from "react-icons/pi";

const defaultPet: Pet = {
  name: "Unknown",
  health_points: 0,
  happiness: 0,
  parts: [],
};

export function NotConnected() {
  const [activePet, setActivePet] = useState<number[]>([0, 0, 0]);
  const [selectedAction, setSelectedAction] = useState<"feed" | "play">("feed");

  const text = useTypingEffect(
    `Welcome to Aptogotchi! Once you connect your wallet, you'll be able to mint your new on-chain pet. Once minted, you'll be able to feed, play with, and customize your new best friend!`
  );

  const handleShuffle = () => {
    const randomPet = [
      Math.floor(
        Math.random() * Number(process.env.NEXT_PUBLIC_REACT_APP_BODY_OPTIONS)
      ),
      Math.floor(
        Math.random() * Number(process.env.NEXT_PUBLIC_REACT_APP_EAR_OPTIONS)
      ),
      Math.floor(
        Math.random() * Number(process.env.NEXT_PUBLIC_REACT_APP_FACE_OPTIONS)
      ),
    ];
    setActivePet(randomPet);

    const actions = ["feed", "play"];
    const randomAction = actions[Math.floor(Math.random() * actions.length)] as
      | "feed"
      | "play";
    setSelectedAction(randomAction);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-6 self-center">
        <PetImage
          pet={defaultPet}
          selectedAction={selectedAction}
          petParts={{
            body: bodies[activePet[0]],
            ears: ears[activePet[1]],
            face: faces[activePet[2]],
          }}
        />
        <button
          type="button"
          className="nes-btn flex flex-row justify-center items-center"
          onClick={handleShuffle}
        >
          <h2>Shuffle</h2>
          <PiShuffleAngularFill className="h-8 w-8 drop-shadow-sm" />
        </button>
      </div>
      <div className="nes-container is-dark with-title">
        <p className="title">Welcome</p>
        <p>{text}</p>
      </div>
    </div>
  );
}
