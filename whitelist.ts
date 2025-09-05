import type { DotWhitelistEntry } from "@polkadot-api/descriptors";

export const whitelist: DotWhitelistEntry[] = [
  "tx.Balances.transfer_keep_alive",
  "tx.Balances.*",
  "*.System",
  "query.*",
];
