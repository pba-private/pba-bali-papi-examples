import { chainSpec } from "polkadot-api/chains/polkadot";
import { getSmProvider } from "polkadot-api/sm-provider";
import { start } from "polkadot-api/smoldot";
import type { JsonRpcProvider } from "polkadot-api/ws-provider/web";
import { createClient } from "@polkadot-api/substrate-client";
import { decAnyMetadata, u32 } from "@polkadot-api/substrate-bindings";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { toHex } from "polkadot-api/utils";

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

    if (evt.type === "initialized") {
      const result = await chainHead.call(
        evt.finalizedBlockHashes[0],
        "Metadata_metadata_at_version",
        toHex(u32.enc(15))
      );

      const metadata = decAnyMetadata(result);
      console.log("metadata", metadata);
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
