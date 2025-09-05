import { local, nextLocal, MultiAddress } from "@polkadot-api/descriptors";
import { Binary, CompatibilityLevel, createClient } from "polkadot-api";
import { connectInjectedExtension } from "polkadot-api/pjs-signer";
import { getWsProvider } from "polkadot-api/ws-provider/web";
import { useEffect, useState } from "react";
import "./App.css";

const client = createClient(getWsProvider("ws://localhost:9944/"));
const typedApi = client.getTypedApi(local);
const nextApi = client.getTypedApi(nextLocal);

const extension = await connectInjectedExtension("polkadot-js");
const signerAccount = extension
  .getAccounts()
  .find((v) => v.name === "PBA Oliva")!;

function App() {
  const [account, setAccount] = useState("");
  const [remark, setRemark] = useState("");
  const [amount, setAmount] = useState(0);
  const [requiresRemark, setRequiresRemark] = useState(false);

  useEffect(() => {
    client.finalizedBlock$.subscribe(async () => {
      if (
        !(await typedApi.tx.Balances.transfer_keep_alive.isCompatible(
          CompatibilityLevel.BackwardsCompatible
        ))
      ) {
        setRequiresRemark(true);
      }
    });
  }, []);

  const submit = () => {
    const tx = requiresRemark
      ? nextApi.tx.Balances.transfer_keep_alive({
          dest: MultiAddress.Id(account),
          value: BigInt(amount),
          remark: Binary.fromText(remark),
        })
      : typedApi.tx.Balances.transfer_keep_alive({
          dest: MultiAddress.Id(account),
          value: BigInt(amount),
        });

    tx.signSubmitAndWatch(signerAccount.polkadotSigner).subscribe((r) => {
      console.log(r);
    });
  };

  return (
    <>
      <h3>Transfer!</h3>
      <div>
        Account
        <input
          type="text"
          value={account}
          onChange={(evt) => setAccount(evt.target.value)}
        />
      </div>
      <div>
        Amount
        <input
          type="number"
          value={amount}
          onChange={(evt) => setAmount(evt.target.valueAsNumber)}
        />
      </div>
      {requiresRemark ? (
        <div>
          Remark
          <input
            type="text"
            value={remark}
            onChange={(evt) => setRemark(evt.target.value)}
          />
        </div>
      ) : null}
      <button type="button" onClick={submit}>
        Submit
      </button>
    </>
  );
}

export default App;
