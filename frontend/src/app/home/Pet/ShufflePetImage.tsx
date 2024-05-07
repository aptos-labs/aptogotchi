"use client";

import React from "react";
import { PetParts } from ".";
import { PetImage } from "./Image";
import { ShuffleButton } from "@/components/ShuffleButton";
import {
  NEXT_PUBLIC_BODY_OPTIONS,
  NEXT_PUBLIC_EAR_OPTIONS,
  NEXT_PUBLIC_FACE_OPTIONS,
} from "@/utils/env";

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
      <PetImage petParts={petParts} />
      <ShuffleButton handleShuffle={handleShuffle} />
    </div>
  );
}
