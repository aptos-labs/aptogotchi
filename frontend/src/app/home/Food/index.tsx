"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { FoodBar } from "@/components/FoodBar";

export interface Food {
  number: number;
}

interface FoodProps {
  food: Food;
}

export function Food({ food }: FoodProps) {
  return (
    <div>
      <FoodBar totalFood={10} currentFood={food?.number} icon={"heart"} />
    </div>
  );
}
