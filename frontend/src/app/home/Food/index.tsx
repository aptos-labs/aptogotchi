"use client";

import { Dispatch, SetStateAction } from "react";
import { FoodBar } from "@/components/FoodBar";

export interface Food {
  number: number;
}

interface FoodProps {
  food: Food;
  setFood?: Dispatch<SetStateAction<Food | undefined>>;
}

export function Food({ food, setFood }: FoodProps) {
  return (
    <div>
      <FoodBar totalFood={10} currentFood={food?.number} icon={"heart"} />
    </div>
  );
}
