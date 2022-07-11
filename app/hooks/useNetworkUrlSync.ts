import { allChains, useAccount } from "wagmi";
import type { Dispatch } from "react";
import type { ActionTypes } from "~/routes/swap/reducer";

const chainsByName = allChains.reduce<Record<string, any>>(
  (acc, curr) =>
    curr.name ? { ...acc, [curr.name.toLowerCase()]: curr } : curr,
  {}
);

// TODO: Refactor to support other networks. Currently hardcoded to Ethereum & Polygon.
export function useNetworkUrlSync(dispatch: Dispatch<ActionTypes>) {
  useAccount({
    async onConnect({ connector }) {
      const params = new URLSearchParams(window.location.search);
      const network = params.get("network");

      if (network) {
        const params = new URLSearchParams(window.location.search);

        params.set("network", network);
        history.replaceState(null, "", `?${params.toString()}`);
        connector?.connect({ chainId: chainsByName[network].id });
        dispatch({ type: "select network", payload: network });
      } else {
        const network =
          (await connector?.getChainId()) === 137 ? "polygon" : "ethereum";
        const params = new URLSearchParams(window.location.search);

        params.set("network", network);
        history.replaceState(null, "", `?${params.toString()}`);
        dispatch({ type: "select network", payload: network });
      }

      connector?.on("change", (data) => {
        const network = data.chain?.id === 1 ? "ethereum" : "polygon";
        const params = new URLSearchParams(window.location.search);

        params.set("network", network);
        history.replaceState(null, "", `?${params.toString()}`);
        dispatch({ type: "select network", payload: network });
      });
    },
  });
}
