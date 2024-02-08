"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { PetImage } from "./Image";

export interface Pet {
  name: string;
  birthday: number;
  parts: PetParts;
}

export interface PetParts {
  body: number;
  ear: number;
  face: number;
}

export const DEFAULT_PET = {
  name: "Unknown",
  parts: {
    body: 0,
    ear: 0,
    face: 0,
  },
};

interface PetProps {
  pets: Pet[];
}

export function MyPets({ pets }: PetProps) {
  return (
    <div className="flex flex-col self-center m-10">
      {/* <div className="flex flex-row self-center gap-12">
        <div className="flex flex-col gap-4 w-[360px]">
          <PetImage petParts={pet.parts} avatarStyle />
        </div>
      </div> */}
      <div className="flex flex-row gap-4">
        {pets.map((pet, index) => (
          <div key={index} className="flex flex-col gap-4">
            <h3 className="text-2xl">{pet.name}</h3>
            <PetImage petParts={pet.parts} avatarStyle />
          </div>
        ))}
      </div>
    </div>
  );
}
