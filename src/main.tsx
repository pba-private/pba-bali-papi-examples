import { chainSpec } from "polkadot-api/chains/polkadot";
import { getSmProvider } from "polkadot-api/sm-provider";
import { start } from "polkadot-api/smoldot";
import type { JsonRpcProvider } from "polkadot-api/ws-provider/web";
import { createClient } from "@polkadot-api/substrate-client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const smoldot = start();
const chain = smoldot.addChain({
  chainSpec,
});

const smoldotProvider = getSmProvider(chain);

const provider: JsonRpcProvider = (onMsg) => {
  const smoldotConnection = smoldotProvider((msg) => {
    console.log(msg);
    onMsg(msg);
  });

  return {
    send(message) {
      console.log(message);
      smoldotConnection.send(message);
    },
    disconnect() {
      smoldotConnection.disconnect();
    },
  };
};

const client = createClient(provider);

const chainHead = client.chainHead(
  true,
  async (evt) => {
    console.log(evt);

    if (evt.type === "finalized") {
      const bodies = await Promise.all(
        evt.finalizedBlockHashes.map((hash) => chainHead.body(hash))
      );
      console.log(bodies);
    }
  },
  (err) => {
    console.log("error", err);
  }
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
