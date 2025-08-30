import { pas, dot } from "@polkadot-api/descriptors";
import { CompatibilityLevel, createClient } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws-provider/web";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const client = createClient(getWsProvider("wss://paseo.rpc.amforc.com"));
const typedApi = client.getTypedApi(pas);
const dotTypedApi = client.getTypedApi(dot);

const token = await typedApi.compatibilityToken;

function calculateSomethingAboutBounties() {
  const result = typedApi.constants.Bounties.BountyValueMinimum(token);
}

const res = await typedApi.query.System.Account.getValue(
  "5FxrUu1PUugUYs6HQ83bDswjGLyHYTEzm7yqmrkKVPaYe71Y"
);
console.log("my account", res);

if (typedApi.query.Sudo.Key.isCompatible(CompatibilityLevel.Identical, token)) {
  const key = await typedApi.query.Sudo.Key.getValue();
  console.log("sudo key", key);
} else {
  await dotTypedApi.query;
}

typedApi.query.System.Events.watchValue().subscribe((events) => {
  console.log(events);
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
