"use client";

import React, { useState } from "react";
import { useTypingEffect } from "@/utils/useTypingEffect";
import { Pet } from "./Pet";
import { PetImage, bodies, ears, faces } from "./Pet/Image";
import { ShuffleButton } from "@/components/ShuffleButton";
import {
  NEXT_PUBLIC_BODY_OPTIONS,
  NEXT_PUBLIC_EAR_OPTIONS,
  NEXT_PUBLIC_FACE_OPTIONS,
} from "@/utils/env";

import { ShufflePetImage } from "./Pet/ShufflePetImage";

export function NotConnected() {
  const [petParts, setPetParts] = useState<number[]>([0, 0, 0]);

  const text = useTypingEffect(
    `Welcome to Aptogotchi! Once you connect your wallet, you'll be able to mint your new on-chain pet. Once minted, you'll be able to feed, play with, and customize your new best friend!`
  );

  const handleShuffle = () => {
    const randomPet = [
      Math.floor(Math.random() * Number(NEXT_PUBLIC_BODY_OPTIONS)),
      Math.floor(Math.random() * Number(NEXT_PUBLIC_EAR_OPTIONS)),
      Math.floor(Math.random() * Number(NEXT_PUBLIC_FACE_OPTIONS)),
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
      <ShufflePetImage petParts={petParts} setPetParts={setPetParts} />
      <div className="nes-container is-dark with-title">
        <p className="title">Welcome</p>
        <p>{text}</p>
      </div>
    </div>
  );
}
