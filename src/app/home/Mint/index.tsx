import { useState } from "react";

export function Mint() {
  const [newName, setNewName] = useState("");

  return (
    <div className="flex flex-col gap-8 max-w-md self-center pt-8">
      <h2 className="text-xl pb-4">Tell us about your pet</h2>
      <div className="nes-field">
        <label htmlFor="name_field">Name</label>
        <input
          type="text"
          id="name_field"
          className="nes-input"
          value={newName}
          onChange={(e) => setNewName(e.currentTarget.value)}
        />
      </div>
      <button
        type="button"
        className={`nes-btn ${newName ? "is-success" : "is-disabled"}`}
        disabled={!newName}
      >
        Mint Pet
      </button>
    </div>
  );
}
