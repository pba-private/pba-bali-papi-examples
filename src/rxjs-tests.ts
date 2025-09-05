import { createClient } from "polkadot-api";
import { Observable, map, interval, switchMap, EMPTY, from } from "rxjs";
import { getWsProvider } from "polkadot-api/ws-provider/web";
import { dot } from "@polkadot-api/descriptors";

const client = createClient(getWsProvider("wss://polkadot-rpc.publicnode.com"));
const typedApi = client.getTypedApi(dot);

const ACCOUNT = "1jbZxCFeNMRgVRfggkknf8sTWzrVKbzLvRuLWvSyg9bByRG";
const TRACK = 33;

const getVoteDirection = (vote: number) =>
  vote & 0x80 ? ("aye" as const) : ("nay" as const);

const referendaWithSameOutcome$ =
  typedApi.query.ConvictionVoting.VotingFor.watchValue(ACCOUNT, TRACK).pipe(
    switchMap((voteInfo) => {
      if (voteInfo.type === "Delegating") return EMPTY;

      const votes = voteInfo.value.votes
        .filter(([, vote]) => vote.type === "Standard")
        .map(([refId, vote]) => ({
          refId,
          voteDirection:
            vote.type === "Standard"
              ? getVoteDirection(vote.value.vote)
              : // unreachable
                "aye",
        }));

      return from(
        typedApi.query.Referenda.ReferendumInfoFor.getValues(
          // votes.map(({ refId }) => [refId])
          votes.map((vote) => [vote.refId])
        )
      ).pipe(
        map((referenda) => {
          const result: number[] = [];

          referenda.forEach((referendum, i) => {
            if (referendum?.type !== "Ongoing") return;

            const voteDirection = votes[i].voteDirection;
            const currentOutcome =
              referendum.value.tally.ayes > referendum.value.tally.nays
                ? ("aye" as const)
                : ("nay" as const);

            if (voteDirection === currentOutcome) {
              result.push(votes[i].refId);
            }
          });

          return result;
        })
      );
    })
  );

referendaWithSameOutcome$.subscribe(console.log);
