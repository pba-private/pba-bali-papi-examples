import { chainSpec } from "polkadot-api/chains/polkadot";
import { getSmProvider } from "polkadot-api/sm-provider";
import { start } from "polkadot-api/smoldot";
import {
  getWsProvider,
  type JsonRpcProvider,
} from "polkadot-api/ws-provider/web";
import { decAnyMetadata, u32 } from "@polkadot-api/substrate-bindings";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { toHex } from "polkadot-api/utils";
import { createClient } from "polkadot-api";

const client = createClient(getWsProvider("ws://localhost:8000"));

console.log("Creating new block");
const block = await client._request("dev_newBlock", []);

console.log("New block", block);

await client._request("dev_setStorage", [
  [
    [
      "0x5c0d1176a568c1f92944340dbfed9e9c530ebca703c85910e7164cb7d1c9e47b",
      "0xac7a7e96dd3562f7b16dbfc0db669d2facd2489ef5116ce25d5dbd4d4141214c",
    ],
  ],
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
