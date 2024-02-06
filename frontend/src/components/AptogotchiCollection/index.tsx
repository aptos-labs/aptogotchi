import React, { useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useGetAptogotchiCollection } from "@/hooks/useGetAptogotchiCollection";

export function AptogotchiCollection() {
  const { account, network } = useWallet();
  const { collection, firstFewAptogotchiName, loading, fetchCollection } =
    useGetAptogotchiCollection();

  useEffect(() => {
    if (!account?.address || !network) return;
    fetchCollection();
  }, [account?.address, fetchCollection, network]);

  if (loading || !collection) return null;

  console.log("firstFewAptogotchiName", firstFewAptogotchiName);
  const firstFewAptogotchiCount = firstFewAptogotchiName?.length || 0;

  return (
    <div className="nes-container with-title h-[100px]">
      <p>{`In total there are ${collection.current_supply} Aptogotchis in existence.`}</p>
      {firstFewAptogotchiCount > 0 && (
        <p>{`Meet your fellow Aptogotchis: ${firstFewAptogotchiName?.join(
          ", "
        )}${
          firstFewAptogotchiCount < collection.current_supply - 1 ? "..." : ""
        }`}</p>
      )}
    </div>
  );
}
