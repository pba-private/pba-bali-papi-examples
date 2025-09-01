import { chainSpec } from "polkadot-api/chains/polkadot";
import { getSmProvider } from "polkadot-api/sm-provider";
import { start } from "polkadot-api/smoldot";
import type { JsonRpcProvider } from "polkadot-api/ws-provider/web";
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

let id = 0;
let followSubscription: string | null = null;

const requestIdToResolveFn = new Map<number, (value: string[]) => void>();
const operationIdToResolveFn = new Map<string, (value: string[]) => void>();

const connection = provider(async (msg) => {
  const parsedMsg = JSON.parse(msg);

  // Figure out follow subscription
  if (parsedMsg.id === followId) {
    followSubscription = parsedMsg.result;
  }

  const resolveFn = requestIdToResolveFn.get(parsedMsg.id);
  if (resolveFn) {
    requestIdToResolveFn.delete(parsedMsg.id);
    operationIdToResolveFn.set(parsedMsg.result.operationId, resolveFn);
  }

  if (
    parsedMsg.method === "chainHead_v1_followEvent" &&
    parsedMsg.params.result.event === "operationBodyDone"
  ) {
    const operationId = parsedMsg.params.result.operationId;
    const value = parsedMsg.params.result.value;

    const resolveFn = operationIdToResolveFn.get(operationId);
    if (!resolveFn) {
      console.warn("unknown operation id", operationId);
      return;
    }
    resolveFn(value);
  }

  if (
    parsedMsg.method === "chainHead_v1_followEvent" &&
    parsedMsg.params.result.event === "stop"
  ) {
    sendFollow();
  }

  if (
    parsedMsg.method === "chainHead_v1_followEvent" &&
    parsedMsg.params.result.event === "finalized"
  ) {
    const results = await Promise.all(
      parsedMsg.params.result.finalizedBlockHashes.map((hash: string) =>
        getBody(hash)
      )
    );
    console.log("all bodies", results);
  }
});

function getBody(blockHash: string): Promise<string[]> {
  if (followSubscription == null) {
    throw new Error("Follow not ready yet");
  }

  return new Promise<string[]>((resolve) => {
    const reqId = ++id;

    requestIdToResolveFn.set(reqId, resolve);

    connection.send(
      JSON.stringify({
        jsonrpc: "2.0",
        id: reqId,
        method: "chainHead_v1_body",
        params: [followSubscription, blockHash],
      })
    );
  });
}

(window as any).getBody = getBody;

let followId: number | null = null;
function sendFollow() {
  followId = ++id;

  connection.send(
    JSON.stringify({
      jsonrpc: "2.0",
      id: followId,
      method: "chainHead_v1_follow",
      params: [true],
    })
  );
}
sendFollow();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
