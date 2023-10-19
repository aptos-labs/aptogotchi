// In some case the leading char is 0 after the 0x and it got truncated
// This function will add it back if needed cause indexer doesn't auto pad it
export function padAddressIfNeeded(address: string) {
  if (address.length === 67) {
    return address;
  }
  return `0x0${address.slice(2)}`;
}
