import { Food } from "@/app/home/Food";
import { range } from "@/utils/range";

export interface FoodBarProps {
  totalFood: number;
  currentFood: number
  icon: "heart";
}

export const BASE_PATH = "/assets/";

export function FoodBar({
  totalFood,
  currentFood,
  icon,
}: FoodBarProps) {
  const fullIcons = Math.floor(currentFood / 2);
  const halfIcons = currentFood % 2;
  const emptyIcons = Math.floor((totalFood - currentFood) / 2);

  return (
    <div className="flex flex-wrap gap-1">
        {range(fullIcons).map((i) => (
        <i key={i} className={`nes-icon ${icon}`} />
        ))}
        {range(halfIcons).map((i) => (
        <i key={i} className={`nes-icon is-half ${icon}`} />
        ))}
        {range(emptyIcons).map((i) => (
        <i key={i} className={`nes-icon is-empty ${icon}`} />
        ))}
    </div>
  );
}
