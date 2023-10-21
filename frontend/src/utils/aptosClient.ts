import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

export function getAptosClient() {
  const config = new AptosConfig({ network: Network.TESTNET });
  return new Aptos(config);
}
