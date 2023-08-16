"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Connected } from "./Connected";
import { NotConnected } from "./NotConnected";

export function Body() {
  const { connected, isLoading } = useWallet();

  // TODO: Design a nice loading screen
  if (isLoading) return null;

  if (connected) return <Connected />;

  return <NotConnected />;
}
