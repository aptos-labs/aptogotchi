"use client";

import { Pet } from "./Pet";

export function Connected() {
  const pet = {
    name: "Bob",
    health: 5,
    happiness: 9,
  };

  return (
    <div className="flex flex-col gap-3 p-3">
      <Pet pet={pet} />
    </div>
  );
}
