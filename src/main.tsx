import { pas } from "@polkadot-api/descriptors";
import { createClient } from "polkadot-api";
import { chainSpec } from "polkadot-api/chains/polkadot";
import { getSmProvider } from "polkadot-api/sm-provider";
import { start } from "polkadot-api/smoldot";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { withLogsRecorder } from "polkadot-api/logs-provider";

const smoldot = start();
const chain = smoldot.addChain({
  chainSpec,
});

const client = createClient(
  withLogsRecorder(console.log, getSmProvider(chain))
);
const typedApi = client.getTypedApi(pas);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
