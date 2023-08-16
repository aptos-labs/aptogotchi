"use client";

import { useTypingEffect } from "@/utils/useTypingEffect";

export function NotConnected() {
  const text = useTypingEffect(`Your wallet is not connected.`);

  return (
    <div className="p-3">
      <div className="nes-container is-dark with-title">
        <p className="title">Welcome</p>
        <p>{text}</p>
      </div>
    </div>
  );
}
