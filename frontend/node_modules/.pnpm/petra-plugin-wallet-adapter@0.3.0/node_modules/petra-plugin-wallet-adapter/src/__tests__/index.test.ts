import { PetraWallet } from "../index";

describe("PetraWallet", () => {
  const wallet = new PetraWallet();

  test("defines name", () => {
    expect(typeof wallet.name).toBe("string");
  });

  test("defines url", () => {
    expect(typeof wallet.url).toBe("string");
  });

  test("defines icon", () => {
    expect(typeof wallet.icon).toBe("string");
  });

  test("defines connect()", () => {
    expect(typeof wallet.connect).toBe("function");
  });

  test("defines account()", () => {
    expect(typeof wallet.account).toBe("function");
  });

  test("defines disconnect()", () => {
    expect(typeof wallet.disconnect).toBe("function");
  });

  test("defines signAndSubmitTransaction()", () => {
    expect(typeof wallet.signAndSubmitTransaction).toBe("function");
  });

  test("defines signAndSubmitBCSTransaction()", () => {
    expect(typeof wallet.signAndSubmitBCSTransaction).toBe("function");
  });

  test("defines signMessage()", () => {
    expect(typeof wallet.signMessage).toBe("function");
  });

  test("defines signTransaction()", () => {
    expect(typeof wallet.signTransaction).toBe("function");
  });

  test("defines onNetworkChange()", () => {
    expect(typeof wallet.onNetworkChange).toBe("function");
  });

  test("defines onAccountChange()", () => {
    expect(typeof wallet.onAccountChange).toBe("function");
  });

  test("defines network()", () => {
    expect(typeof wallet.network).toBe("function");
  });
});
