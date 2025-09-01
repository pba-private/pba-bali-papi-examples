import { pas } from "@polkadot-api/descriptors";
import { createClient } from "polkadot-api";
import { chainSpec } from "polkadot-api/chains/polkadot";
import { getSmProvider } from "polkadot-api/sm-provider";
import type { JsonRpcProvider } from "polkadot-api/ws-provider/web";
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

const smoldotProvider = getSmProvider(chain);

const provider: JsonRpcProvider = (onMsg) => {
  const smoldotConnection = smoldotProvider((msg) => {
    console.log(`<<-${Date.now()}-${msg}`);
    onMsg(msg);
  });

  return {
    send(message) {
      console.log(`>>-${Date.now()}-${message}`);
      smoldotConnection.send(message);
    },
    disconnect() {
      smoldotConnection.disconnect();
    },
  };
};

const connection = provider((msg) => {
  // TODO
});

connection.send(
  JSON.stringify({
    jsonrpc: "2.0",
    id: "0",
    method: "chainHead_v1_follow",
    params: [true],
  })
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
