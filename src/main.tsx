import { pas } from "@polkadot-api/descriptors";
import { createClient, type SS58String } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws-provider/web";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const client = createClient(getWsProvider("wss://paseo.rpc.amforc.com"));
const typedApi = client.getTypedApi(pas);

const res = await typedApi.query.System.Account.getValue(
  "5FxrUu1PUugUYs6HQ83bDswjGLyHYTEzm7yqmrkKVPaYe71Y"
);
console.log("my account", res);

async function getSudoAccountFreeBalance(): Promise<bigint> {}

async function findAllProxyAccountsOfTypeAny(): Promise<Array<SS58String>> {}

async function findMaxProxyAccounts(): Promise<Array<SS58String>> {
  // Find the proxy accounts that have the maximum allowed proxy delegates
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
