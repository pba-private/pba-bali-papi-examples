import { createClient } from "polkadot-api";
import { chainSpec } from "polkadot-api/chains/paseo";
import { getSmProvider } from "polkadot-api/sm-provider";
import { start } from "polkadot-api/smoldot";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { pas } from "@polkadot-api/descriptors";
import { Subscription } from "rxjs";

const smoldot = start();
const chain = smoldot.addChain({
  chainSpec,
});
const client = createClient(getSmProvider(chain));
const typedApi = client.getTypedApi(pas);

let subscription: Subscription | null = null;
typedApi.query.Sudo.Key.watchValue().subscribe((key) => {
  if (subscription) {
    subscription.unsubscribe();
  }

  subscription = typedApi.query.System.Account.watchValue(key!).subscribe(
    (value) => {
      console.log(value);
    }
  );
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
