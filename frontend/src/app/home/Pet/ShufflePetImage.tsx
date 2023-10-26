"use client";

import React from "react";
import { Pet } from ".";
import { PetImage, bodies, ears, faces } from "./Image";
import { ShuffleButton } from "@/components/ShuffleButton";
import {
  NEXT_PUBLIC_BODY_OPTIONS,
  NEXT_PUBLIC_EAR_OPTIONS,
  NEXT_PUBLIC_FACE_OPTIONS,
} from "@/utils/env";

const defaultPet: Pet = {
  name: "Unknown",
  energy_points: 0,
  parts: [],
};

export function ShufflePetImage({
  petParts,
  setPetParts,
}: {
  petParts: number[];
  setPetParts: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const handleShuffle = () => {
    const randomPet = [
      Math.floor(Math.random() * Number(NEXT_PUBLIC_BODY_OPTIONS)),
      Math.floor(Math.random() * Number(NEXT_PUBLIC_EAR_OPTIONS)),
      Math.floor(Math.random() * Number(NEXT_PUBLIC_FACE_OPTIONS)),
    ];
    setPetParts(randomPet);
  };

  return (
    <div className="flex flex-col gap-6 self-center">
      <PetImage
        pet={defaultPet}
        petParts={{
          body: bodies[petParts[0]],
          ears: ears[petParts[1]],
          face: faces[petParts[2]],
        }}
      />
      <ShuffleButton handleShuffle={handleShuffle} />
    </div>
  );
}
