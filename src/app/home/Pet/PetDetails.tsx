"use client";

import { HealthBar } from "@/components/HealthBar";
import { Pet } from ".";

export interface PetDetailsProps {
  pet: Pet;
}

export function PetDetails({ pet }: PetDetailsProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="nes-field">
        <label htmlFor="name_field">Name</label>
        <input
          type="text"
          id="name_field"
          className="nes-input"
          value={pet.name}
        />
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
