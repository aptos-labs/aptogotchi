"use client";

import { useState } from "react";

type PetAction = "feed" | "play" | "customize";

export interface ActionsProps {}

export function Actions(props: ActionsProps) {
  const [selectedAction, setSelectedAction] = useState<PetAction>("feed");

  return (
    <div className="nes-container with-title flex-1 bg-white">
      <p className="title">Actions</p>
      <div className="flex gap-12 justify-between h-full">
        <div className="flex flex-col flex-shrink-0 gap-1">
          <label>
            <input
              type="radio"
              className="nes-radio"
              name="action"
              checked={selectedAction === "feed"}
              onChange={() => setSelectedAction("feed")}
            />
            <span>Feed</span>
          </label>
          <label>
            <input
              type="radio"
              className="nes-radio"
              name="action"
              checked={selectedAction === "play"}
              onChange={() => setSelectedAction("play")}
            />
            <span>Play</span>
          </label>
          <label>
            <input
              type="radio"
              className="nes-radio"
              name="action"
              checked={selectedAction === "customize"}
              onChange={() => setSelectedAction("customize")}
            />
            <span>Customize</span>
          </label>
        </div>
        <div className="w-1 h-full bg-zinc-300 flex-shrink-0" />
        <div className="flex flex-col gap-1 justify-between">
          <p>{actionDescriptions[selectedAction]}</p>
          <button type="button" className="nes-btn is-success">
            Start
          </button>
        </div>
      </div>
    </div>
  );
}

const actionDescriptions: Record<PetAction, string> = {
  feed: "Feeding your pet will boost its HP and Happiness stats...",
  play: "Playing with your pet will greatly boost its Happiness stat but deplete some of its HP...",
  customize:
    "Customize your pet to give it a fresh new look and truly make it yours...",
};
