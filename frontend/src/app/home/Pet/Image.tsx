/* eslint-disable @next/next/no-img-element */
"use client";

import { Pet } from ".";
import { PetAction } from "./Actions";

export interface PetImageProps {
  pet: Pet;
  selectedAction?: PetAction;
  petParts: {
    body: string;
    ears: string;
    face: string;
  };
  avatarStyle?: boolean;
}

export function PetImage(props: PetImageProps) {
  const { avatarStyle, petParts, selectedAction } = props;
  const head = BASE_PATH + "head.png";
  const body = BASE_PATH + petParts.body;
  const ears = BASE_PATH + petParts.ears;
  const face = BASE_PATH + petParts.face;

  const imgClass = "absolute top-0 left-0 w-full h-full object-contain";

  const animation =
    selectedAction === "play" ? "animate-wiggle" : "animate-hop";

  return (
    <div
      className={`bg-[hsl(104,40%,75%)] border-double border-8 border-black p-2 relative ${
        avatarStyle ? "h-44 w-44" : "h-80 w-80"
      }`}
    >
      <div className={`relative h-full w-full ${animation}`}>
        <img src={head} className={imgClass} alt="pet head" />
        <img src={body} className={imgClass} alt="pet body" />
        <img src={ears} className={imgClass} alt="pet ears" />
        <img src={face} className={imgClass} alt="pet face" />
      </div>
    </div>
  );
}

export const BASE_PATH = "/pet-parts/";

export const bodies = [
  "body1.png",
  "body2.png",
  "body3.png",
  "body4.png",
  "body5.png",
];

export const ears = [
  "ear1.png",
  "ear2.png",
  "ear3.png",
  "ear4.png",
  "ear5.png",
  "ear6.png",
];

export const faces = ["face1.png", "face2.png", "face3.png", "face4.png"];
