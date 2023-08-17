"use client";

import { AiFillSave } from "react-icons/ai";
import { HealthBar } from "@/components/HealthBar";
import { Pet } from ".";
import { useState } from "react";

export interface PetDetailsProps {
  pet: Pet;
}

export function PetDetails({ pet }: PetDetailsProps) {
  const [newName, setNewName] = useState(pet.name);

  const canSave = newName !== pet.name;

  return (
    <div className="flex flex-col gap-5">
      <div className="nes-field">
        <label htmlFor="name_field">Name</label>
        <div className="relative">
          <input
            type="text"
            id="name_field"
            className="nes-input"
            value={newName}
            onChange={(e) => setNewName(e.currentTarget.value)}
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 nes-pointer disabled:cursor-not-allowed text-sky-500 disabled:text-gray-400"
            disabled={!canSave}
          >
            <AiFillSave className=" h-8 w-8 drop-shadow-sm" />
          </button>
        </div>
      </div>
      <div className="flex flex-col">
        <label>HP</label>
        <HealthBar totalHealth={10} currentHealth={pet.health} icon="heart" />
      </div>
      <div className="flex flex-col">
        <label>Happiness</label>
        <HealthBar totalHealth={10} currentHealth={pet.happiness} icon="star" />
      </div>
    </div>
  );
}
