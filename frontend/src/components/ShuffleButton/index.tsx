import { PiShuffleAngularFill } from "react-icons/pi";

export interface ShuffleButtonProps {
  handleShuffle: () => void;
}

export function ShuffleButton({ handleShuffle }: ShuffleButtonProps) {
  return (
    <button
      type="button"
      className="nes-btn flex flex-row justify-center items-center"
      onClick={handleShuffle}
      style={{ flexDirection: "row", alignItems: "center" }}
    >
      <h2 style={{ flexShrink: 0 }}>Shuffle</h2>
      <PiShuffleAngularFill
        className="h-8 w-12 drop-shadow-sm"
        style={{ flexShrink: 0 }}
      />
    </button>
  );
}
