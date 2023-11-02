import { range } from "@/utils/range";

export interface HealthBarProps {
  totalHealth: number;
  currentHealth: number;
  icon: "heart" | "star";
}

export const BASE_PATH = "/assets/";

export function HealthBar({
  totalHealth,
  currentHealth,
  icon,
}: HealthBarProps) {
  const fullIcons = Math.floor(currentHealth / 2);
  const halfIcons = currentHealth % 2;
  const emptyIcons = Math.floor((totalHealth - currentHealth) / 2);
  const apple = BASE_PATH + "apple-1.png";

  return (
    <div>
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
      {/* <div className="flex flex-wrap gap-1">
              {range(fullIcons).map((i) => (
          // <i key={i} className={`nes-icon ${icon}`} />
          <img key={i} className="nes-avatar" alt="Apple icon" src={apple}></img>
        ))}
      </div> */}
    </div>
  );
}
