"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Actions, PetAction } from "./Actions";
import { PetDetails } from "./Details";
import { PetImage } from "./Image";
import { Summary } from "./Summary";
import { AptogotchiCollection } from "@/components/AptogotchiCollection";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

export interface Pet {
  name: string;
  birthday: number;
  energy_points: number;
  parts: PetParts;
}

export interface PetParts {
  body: number;
  ear: number;
  face: number;
}

export const DEFAULT_PET = {
  name: "Unknown",
  energy_points: 0,
  parts: {
    body: 0,
    ear: 0,
    face: 0,
  },
};

interface PetProps {
  pet: Pet;
  setPet: Dispatch<SetStateAction<Pet | undefined>>;
  mintSuccess: boolean;
}

export function Pet({ pet, setPet, mintSuccess }: PetProps) {
  const { width, height } = useWindowSize();
  const [selectedAction, setSelectedAction] = useState<PetAction>("play");

  return (
    <>
      {mintSuccess && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={3000}
          tweenDuration={15000}
        />
      )}
      <div className="flex flex-col self-center m-10">
        <div className="flex flex-row self-center gap-12">
          <div className="flex flex-col gap-4 w-[360px]">
            <PetImage
              selectedAction={selectedAction}
              petParts={pet.parts}
              avatarStyle
            />
            <PetDetails pet={pet} setPet={setPet} />
          </div>
          <div className="flex flex-col gap-8 w-[680px] h-full">
            <Actions
              selectedAction={selectedAction}
              setSelectedAction={setSelectedAction}
              setPet={setPet}
              pet={pet}
            />
            <Summary pet={pet} />
          </div>
        </div>
        <AptogotchiCollection />
      </div>
    </>
  );
}
