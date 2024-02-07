"use client";

import Lottie from "react-lottie";
import animationData from "./mystery-box.json";

export function MysteryPetImage({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex flex-col gap-2 self-center">
      <Lottie options={defaultOptions} height={height} width={width} />
    </div>
  );
}
