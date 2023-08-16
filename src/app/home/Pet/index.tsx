"use client";

import { useState } from "react";
import {
  useWallet,
  WalletReadyState,
  Wallet,
  isRedirectable,
  WalletName,
} from "@aptos-labs/wallet-adapter-react";
import { AiOutlineEdit, AiOutlineSave } from "react-icons/fa";

export function Pet() {
  // connect to Context, get aptogotchi object
  const [editName, setEditName] = useState<boolean>(false);

  return (
    <>
      {editName ? (
        <div className="nes-field">
          <label>New Name</label>
          <input type="text" id="name_field" className="nes-input" />
          <AiOutlineSave onClick={() => setEditName(false)} />
        </div>
      ) : (
        <>
          <h2>Aptogotchi's Name</h2>
          <AiOutlineEdit onClick={() => setEditName(true)} />
        </>
      )}
      <div className="h-72 w-72 bg-neutral-300">Pet image</div>
      <div className="h-64 grid grid-cols-2 gap-4">
        <label>
          <input type="radio" className="nes-radio" name="answer" checked />
          <span>Feed</span>
        </label>
        <label>
          <input type="radio" className="nes-radio" name="answer" checked />
          <span>Play</span>
        </label>
      </div>
    </>
  );
}
