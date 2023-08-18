"use client";

import { useState } from "react";
import { Actions, PetAction } from "./Actions";
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
  const [selectedAction, setSelectedAction] = useState<PetAction>("feed");

  return (
    <div className="flex flex-col gap-6 px-4 py-3">
      <div className="flex flex-wrap gap-6">
        <PetImage pet={pet} selectedAction={selectedAction} />
        <PetDetails pet={pet} />
        <Actions
          selectedAction={selectedAction}
          setSelectedAction={setSelectedAction}
        />
      </div>
      <Summary pet={pet} />
    </div>
  );
}
