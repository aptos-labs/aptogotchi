"use client";

import Lottie from "react-lottie";
import animationData from "./mystery-box.json";

export function MysteryPetImage() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex flex-col gap-6 self-center">
      <Lottie options={defaultOptions} height={400} width={400} />
    </div>
  );
}
