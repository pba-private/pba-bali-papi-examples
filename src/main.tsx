import { createClient } from "polkadot-api";
import { chainSpec } from "polkadot-api/chains/paseo";
import { getSmProvider } from "polkadot-api/sm-provider";
import { start } from "polkadot-api/smoldot";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { pas } from "@polkadot-api/descriptors";

const smoldot = start();
const chain = smoldot.addChain({
  chainSpec,
});
const client = createClient(getSmProvider(chain));
const typedApi = client.getTypedApi(pas);

typedApi.query.Sudo.Key.watchValue().subscribe((r) => {
  console.log("sudo key", r);
});

typedApi.query.System.Account.watchValue("Sudo key").subscribe((r) => {});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
