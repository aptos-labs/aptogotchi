"use client";

import React, { useState } from "react";
import { useTypingEffect } from "@/utils/useTypingEffect";

import { ShufflePetImage } from "./Pet/ShufflePetImage";

export function NotConnected() {
  const [petParts, setPetParts] = useState<number[]>([0, 0, 0]);

  const text = useTypingEffect(
    `Welcome to Aptogotchi! Once you connect your wallet, you'll be able to mint your new on-chain pet. Once minted, you'll be able to feed, play with, and customize your new best friend!`
  );

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
