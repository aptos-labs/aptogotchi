"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Actions, PetAction } from "./Actions";
import { PetDetails } from "./PetDetails";
import { PetImage, bodies, ears, faces } from "./PetImage";
import { Summary } from "./Summary";

export interface Pet {
  name: string;
  health_points: number;
  happiness: number;
}

interface PetProps {
  pet: Pet;
  setPet: Dispatch<SetStateAction<Pet | undefined>>;
}

export function Pet({ pet, setPet }: PetProps) {
  const [selectedAction, setSelectedAction] = useState<PetAction>("feed");

  return (
    <div className="flex flex-col gap-6 px-4 py-3">
      <div className="flex flex-wrap gap-6">
        <PetImage
          pet={pet}
          selectedAction={selectedAction}
          petParts={{
            body: bodies[0],
            ears: ears[0],
            face: faces[0],
          }}
        />
        <PetDetails pet={pet} />
        <Actions
          selectedAction={selectedAction}
          setSelectedAction={setSelectedAction}
          setPet={setPet}
        />
      </div>
      <Summary pet={pet} />
    </div>
  );
}
