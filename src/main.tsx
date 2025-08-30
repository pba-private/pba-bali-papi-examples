import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Binary, CompatibilityLevel, createClient } from "polkadot-api";
import { getSmProvider } from "polkadot-api/sm-provider";
import { start } from "polkadot-api/smoldot";
import { chainSpec } from "polkadot-api/chains/paseo";
import { chainSpec as peopleChainSpec } from "polkadot-api/chains/paseo_people";
import { pas } from "@polkadot-api/descriptors";

const smoldot = start();

const relayChain = smoldot.addChain({
  chainSpec,
  disableJsonRpc: true,
});
// const paraChain = relayChain.then((rc) =>
//   smoldot.addChain({
//     chainSpec: peopleChainSpec,
//     potentialRelayChains: [rc],
//   })
// );

const client = createClient(getSmProvider(relayChain));

// client.finalizedBlock$.subscribe((block) => {
//   console.log("block", block);
// });

// client.blocks$.subscribe(block => {
//   typedApi.query.System.Events.getValue({
//     at: block.hash
//   })
// })

const typedApi = client.getTypedApi(pas);

// typedApi.tx.Referenda.submit({
//   enactment_moment: {
//     type: "After",
//     value: 0,
//   },
//   proposal: {
//     type: "Inline",
//     value: Binary.fromHex("0x"),
//   },
//   proposal_origin: {
//     type: "Origins",
//     value: {} as any,
//   },
// });

typedApi.query.System.Account.getValue("asdf");

typedApi.query.System.Events.watchValue().subscribe((events) => {
  console.log(events);
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
