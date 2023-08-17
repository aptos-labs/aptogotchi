"use client";

import { useTypingEffect } from "@/utils/useTypingEffect";
import { Pet } from ".";

export interface SummaryProps {
  pet: Pet;
}

export function Summary({ pet }: SummaryProps) {
  const text = useTypingEffect(`${pet.name} is starting to get hungry...`);

  return (
    <div className="nes-container is-dark with-title">
      <p className="title">Summary</p>
      <p>{text}</p>
    </div>
  );
}
