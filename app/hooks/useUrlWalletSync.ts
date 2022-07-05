import { useRef, useEffect } from "react";
import { useSearchParams } from "@remix-run/react";
import { allChains, useAccount, useNetwork, useSwitchNetwork } from "wagmi";

/**
 * NOTICE:
 * This code is very brittle and untested. Please manually verify wallet, state, and query param
 * behavior for each code change. Small and incremental code changes recommended.
 */

const chainsByName = allChains.reduce<Record<string, any>>(
  (acc, curr) =>
    curr.name ? { ...acc, [curr.name.toLowerCase()]: curr } : curr,
  {}
);

export function useUrlWalletSync() {
  const allowSync = useRef(true);
  const { chain } = useNetwork();
  const { isConnected } = useAccount()
  const { switchNetwork } = useSwitchNetwork();
  const [searchParams, setSearchParams] = useSearchParams();

  // Syncs wallet to query param `?network=`
  useEffect(() => {
    const network = searchParams.get("network");

    allowSync.current = false;

    if (isConnected && network !== null) {
      switchNetwork && switchNetwork(chainsByName[network].id);
    }

    setTimeout(() => {
      allowSync.current = true;
    }, 1000);
  }, [searchParams, switchNetwork, allowSync, isConnected]);

  // syncs wallet network changes to query param `?network=`
  useEffect(() => {
    if (allowSync.current) {
      if (chain) {
        if (chain?.name.toLowerCase() !== searchParams.get("network")) {
          setSearchParams({
            ...Object.fromEntries(searchParams),
            network: chain?.name.toLowerCase() || "ethereum",
          });
        }
      }
    }
  }, [chain, searchParams, setSearchParams]);
}
