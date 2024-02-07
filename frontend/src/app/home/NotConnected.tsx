"use client";

import { useTypingEffect } from "@/utils/useTypingEffect";

import { MysteryPetImage } from "@/app/home/Pet/MysteryPetImage";

export function NotConnected() {
  const text = useTypingEffect(
    `Welcome to Aptogotchi! Once you connect your wallet, you'll be able to mint your new on-chain pet. Once minted, you'll be able to feed, play with, and customize your new best friend!`
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      <MysteryPetImage width={500} height={500} />
      <div className="nes-container is-dark with-title">
        <p className="title">Welcome</p>
        <p>{text}</p>
      </div>
    </div>
  );
}
