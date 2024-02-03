"use client";

import React from "react";
import { Pet, PetParts } from ".";
import { PetImage } from "./Image";
import { ShuffleButton } from "@/components/ShuffleButton";
import {
  NEXT_PUBLIC_BODY_OPTIONS,
  NEXT_PUBLIC_EAR_OPTIONS,
  NEXT_PUBLIC_FACE_OPTIONS,
} from "@/utils/env";

const defaultPet: Pet = {
  name: "Unknown",
  energy_points: 0,
  parts: {
    body: 0,
    ear: 0,
    face: 0,
  },
};

export function ShufflePetImage({
  petParts,
  setPetParts,
}: {
  petParts: PetParts;
  setPetParts: React.Dispatch<React.SetStateAction<PetParts>>;
}) {
  const handleShuffle = () => {
    const randomPetParts = {
      body: Math.floor(Math.random() * Number(NEXT_PUBLIC_BODY_OPTIONS)),
      ear: Math.floor(Math.random() * Number(NEXT_PUBLIC_EAR_OPTIONS)),
      face: Math.floor(Math.random() * Number(NEXT_PUBLIC_FACE_OPTIONS)),
    };
    setPetParts(randomPetParts);
  };

  return (
    <div className="flex flex-col gap-6 self-center">
      <PetImage pet={defaultPet} petParts={petParts} />
      <ShuffleButton handleShuffle={handleShuffle} />
    </div>
  );
}
