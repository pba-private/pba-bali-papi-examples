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

async function getSudoAccountFreeBalance(): Promise<bigint> {
  const sudoAccountId = await typedApi.query.Sudo.Key.getValue();
  const account = await typedApi.query.System.Account.getValue(sudoAccountId!);

  return account.data.free;
}

async function findAllProxyAccountsThatHaveTypeAny(): Promise<
  Array<SS58String>
> {
  const allProxies = await typedApi.query.Proxy.Proxies.getEntries();

  return allProxies
    .filter(({ value }) =>
      value[0].some((delegation) => delegation.proxy_type.type === "Any")
    )
    .map(({ keyArgs }) => keyArgs[0]);
}

async function findMaxProxyAccounts(): Promise<Array<SS58String>> {
  // Find the proxy accounts that have the maximum allowed proxy delegates
  const maxDelegates = await typedApi.constants.Proxy.MaxProxies();
  const allProxies = await typedApi.query.Proxy.Proxies.getEntries();

  return allProxies
    .filter(({ value }) => value[0].length === maxDelegates)
    .map(({ keyArgs }) => keyArgs[0]);
}

const [sudoFree, typeAnyProxies, maxProxyAccounts] = await Promise.all([
  getSudoAccountFreeBalance(),
  findAllProxyAccountsThatHaveTypeAny(),
  findMaxProxyAccounts(),
]);

console.log({
  sudoFree,
  typeAnyProxies,
  maxProxyAccounts,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
