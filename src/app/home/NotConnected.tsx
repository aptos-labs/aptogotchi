"use client";

import { useTypingEffect } from "@/utils/useTypingEffect";
import { Pet } from "./Pet";
import { PetImage, bodies, ears, faces } from "./Pet/Image";

const defaultPet: Pet = {
  name: "Unknown",
  health_points: 0,
  happiness: 0,
  parts: [],
};

export function NotConnected() {
  const text = useTypingEffect(
    `Welcome to Aptogotchi! Once you connect your wallet, you'll be able to mint your new on-chain pet. Once minted, you'll be able to feed, play with, and customize your new best friend!`
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-6 self-center">
        <PetImage
          pet={defaultPet}
          selectedAction={"feed"}
          petParts={{
            body: bodies[0],
            ears: ears[0],
            face: faces[0],
          }}
        />
        <PetImage
          pet={defaultPet}
          selectedAction={"play"}
          petParts={{
            body: bodies[1],
            ears: ears[1],
            face: faces[1],
          }}
        />
        <PetImage
          pet={defaultPet}
          selectedAction={"feed"}
          petParts={{
            body: bodies[2],
            ears: ears[2],
            face: faces[2],
          }}
        />
      </div>
      <div className="nes-container is-dark with-title">
        <p className="title">Welcome</p>
        <p>{text}</p>
      </div>
    </div>
  );
}
