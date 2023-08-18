/* eslint-disable @next/next/no-img-element */
"use client";

import { Pet } from ".";
import { PetAction } from "./Actions";

export interface PetImageProps {
  pet: Pet;
  selectedAction: PetAction;
}

export function PetImage(props: PetImageProps) {
  const head = "/pet-parts/head.png";
  const body = "/pet-parts/body1.png";
  const ears = "/pet-parts/ear1.png";
  const face = "/pet-parts/face1.png";

  const imgClass = "absolute top-0 left-0 w-full h-full object-contain";

  const animation =
    props.selectedAction === "play" ? "animate-hop" : "animate-wiggle";

  return (
    <div className="h-72 w-72 bg-[hsl(104,40%,75%)] border-double border-8 border-black p-2 relative">
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
