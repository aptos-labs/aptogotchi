"use client";

import { Actions } from "./Actions";
import { PetDetails } from "./PetDetails";
import { PetImage } from "./PetImage";
import { Summary } from "./Summary";

export interface Pet {
  name: string;
  health_points: number;
  happiness: number;
}

interface PetProps {
  pet: Pet;
}

export function Pet({ pet }: PetProps) {
  return (
    <div className="flex flex-col gap-6 px-4 py-3">
      <div className="flex flex-wrap gap-6">
        <PetImage pet={pet} />
        <PetDetails pet={pet} />
        <Actions />
      </div>
      <Summary pet={pet} />
    </div>
  );
}
