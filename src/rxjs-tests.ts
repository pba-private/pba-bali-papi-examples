import { createClient } from "polkadot-api";
import { Observable, map, interval } from "rxjs";
import { getWsProvider } from "polkadot-api/ws-provider/web";
import { dot } from "@polkadot-api/descriptors";

const client = createClient(
  getWsProvider("wss://polkadot-rpc.publicnode.com")
);
const typedApi = client.getTypedApi(dot);

const ACCOUNT = "1jbZxCFeNMRgVRfggkknf8sTWzrVKbzLvRuLWvSyg9bByRG";
const TRACK = 33;


// query.ConvictionVoting.VotingFor.watchValue(account, track)
// query.Referenda.ReferendumInfoFor.getValues([number][])

const referendaWithSameOutcome$ = /* ... */
