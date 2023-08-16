"use client";

import { useTypingEffect } from "@/utils/useTypingEffect";
import { Pet } from "./Pet";

export function Connected() {
  const text = useTypingEffect(`Your wallet is connected!`);

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="nes-container is-dark with-title">
        <p className="title">Welcome</p>
        <p>{text}</p>
      </div>
      <Pet />
    </div>
  );
}
