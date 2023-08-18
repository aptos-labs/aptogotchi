"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
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

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPet((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          health_points: Math.max(0, prev.health_points - 1),
        };
      });

      return () => clearInterval(interval);
    }, 1000 * 60);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPet((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          happiness: Math.max(0, prev.happiness - 1),
        };
      });

      return () => clearInterval(interval);
    }, 1000 * 60 * 2);
  }, []);

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
        <PetDetails pet={pet} setPet={setPet} />
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
