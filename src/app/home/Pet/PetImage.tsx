"use client";

import { Pet } from ".";

export interface PetImageProps {
  pet: Pet;
}

export function PetImage(props: PetImageProps) {
  return <div className="h-80 w-80 bg-[hsl(104,40%,75%)]">Pet image</div>;
}
