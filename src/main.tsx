import { pas } from "@polkadot-api/descriptors";
import { createClient, type SS58String } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws-provider/web";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat";

const client = createClient(
  withPolkadotSdkCompat(getWsProvider("wss://paseo.rpc.amforc.com"))
);
const typedApi = client.getTypedApi(pas);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
