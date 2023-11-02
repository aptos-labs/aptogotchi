"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Action } from "./Actions";
import { PetImage, bodies, ears, faces } from "./Image";

export interface Pet {
  name: string;
  energy_points: number;
  parts: number[];
  accessories: string | null | undefined;
}

interface PetProps {
  pet: Pet;
  setPet: Dispatch<SetStateAction<Pet | undefined>>;
}

export function Pet({ pet, setPet }: PetProps) {
  const [selectedAction, setSelectedAction] = useState<Action>("play");

  return (
    <div className="flex flex-col gap-4 w-[360px]">
      <PetImage
        pet={pet}
        selectedAction={selectedAction}
        petParts={{
          body: bodies[pet.parts[0]],
          ears: ears[pet.parts[1]],
          face: faces[pet.parts[2]],
        }}
        avatarStyle
        accessory_style={pet.accessories}
      />
    </div>
  );
}
