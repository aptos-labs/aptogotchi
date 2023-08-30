"use client";

import { useTypingEffect } from "@/utils/useTypingEffect";
import { Pet } from ".";

export interface SummaryProps {
  pet: Pet;
}

export function Summary({ pet }: SummaryProps) {
  const isSad = pet.happiness < 6;
  const isHungry = pet.health_points < 6;
  const isReallySad = pet.happiness < 3;
  const isReallyHungry = pet.health_points < 3;
  const isDepressed = pet.happiness === 0;
  const isStarved = pet.health_points === 0;

  let text = `${pet.name} is doing great! 😄`;

  if (isSad) {
    text = `${pet.name} is getting a little lonely 🙁. You should consider playing with them...`;
  }
  if (isHungry) {
    text = `${pet.name} is starting to get hungry 😕. You should consider feeding them...`;
  }
  if (isReallySad) {
    text = `${pet.name} is really sad 😔. You should play with them as soon as you can...`;
  }
  if (isReallyHungry) {
    text = `${pet.name} is really hungry 😖. You should feed them as soon as you can...`;
  }
  if (isDepressed) {
    text = `${pet.name} has never been sadder 😢. Play with them right now!`;
  }
  if (isStarved) {
    text = `${pet.name} is literally starving 😥. Feed them right now!`;
  }
  if (isDepressed && isStarved) {
    text = `${pet.name} has died. RIP. 🪦`;
  }

  const typedText = useTypingEffect(text);

  return (
    <div className="nes-container is-dark with-title">
      <p className="title">Summary</p>
      <p>{typedText}</p>
    </div>
  );
}
