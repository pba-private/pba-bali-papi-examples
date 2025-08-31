import { pas } from "@polkadot-api/descriptors";
import {
  Binary,
  createClient,
  InvalidTxError,
  type SS58String,
} from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws-provider/web";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat";
import {
  getInjectedExtensions,
  connectInjectedExtension,
} from "polkadot-api/pjs-signer";

const client = createClient(
  withPolkadotSdkCompat(getWsProvider("wss://paseo.rpc.amforc.com"))
);
const typedApi = client.getTypedApi(pas);

const res = getInjectedExtensions();

const extension = await connectInjectedExtension(res[0]);

const account = extension.getAccounts()[0];

console.log(account);

setTimeout(async () => {
  const tx = typedApi.tx.System.remark({
    remark: Binary.fromText("Hello PBA!"),
  });

  // const r = await tx.signAndSubmit(account.polkadotSigner);
  tx.signSubmitAndWatch(account!.polkadotSigner).subscribe((evt) => {
    switch (evt.type) {
      case "signed":
        console.log("signed", evt.txHash);
        break;
      case "broadcasted":
        console.log("broadcasted", evt.txHash);
        break;
      case "txBestBlocksState":
        console.log("in a best block", evt);
        break;
      case "finalized":
        console.log("finalized", evt);
        break;
    }
  });
}, 1000);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
