"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Pet } from "../Pet";
import { Food } from "../Food";
import { Details } from "../Pet/Details";
import { Summary } from "../Pet/Summary";
import { Action, Actions } from "../Pet/Actions";

interface AptogotchiProps {
  pet: Pet;
  food: Food;
  setPet: Dispatch<SetStateAction<Pet | undefined>>;
  setFood: Dispatch<SetStateAction<Food | undefined>>;
}

export function Aptogotchi({ food, pet, setFood, setPet }: AptogotchiProps) {
  const [selectedAction, setSelectedAction] = useState<Action>("play");

  return (
    <div className="flex flex-row self-center gap-12 m-8">
      <div className="flex flex-col gap-4 w-[360px]">
        <Pet pet={pet} setPet={setPet} />
        <Details food={food} pet={pet} setFood={setFood} setPet={setPet} />
      </div>
      <div className="flex flex-col gap-8 w-[680px] h-full">
        <Actions
          selectedAction={selectedAction}
          setSelectedAction={setSelectedAction}
          setFood={setFood}
          setPet={setPet}
          pet={pet}
          food={food}
        />
        <Summary pet={pet} />
      </div>
    </div>
  );
}
