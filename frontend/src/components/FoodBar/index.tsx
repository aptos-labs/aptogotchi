import { range } from "@/utils/range";
import {
  NEXT_PUBLIC_FOOD_CAP,
} from "@/utils/env";

export interface FoodBarProps {
  currentFood: number
  icon: "heart";
}

export const BASE_PATH = "/assets/";

export function FoodBar({
  currentFood,
  icon,
}: FoodBarProps) {
  // We only display a maximum number of NEXT_PUBLIC_FOOD_CAP for food items
  const foodNumber = currentFood >= Number(NEXT_PUBLIC_FOOD_CAP) ? Number(NEXT_PUBLIC_FOOD_CAP) : currentFood;
  const fullIcons = Math.floor(foodNumber / 2);
  const emptyIcons = Math.floor((Number(NEXT_PUBLIC_FOOD_CAP) - foodNumber) / 2);

  return (
    <div className="flex flex-wrap gap-1">
        {range(fullIcons).map((i) => (
        <img key={i} className='nes-avatar'src='/assets/full_apple.png' style={{imageRendering: "pixelated"}} />
        ))}
        {range(emptyIcons).map((i) => (
        <img key={i} className='nes-avatar'src='/assets/empty_apple.png' style={{imageRendering: "pixelated"}} />
        ))}
    </div>
  );
}
