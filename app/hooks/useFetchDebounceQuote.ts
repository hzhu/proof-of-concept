import qs from "qs";
import {
  useRef,
  useEffect,
} from "react";
import debounce from "lodash.debounce";
import { ENDPOINTS, CHAIN_IDS } from "~/constants";
import type { DebouncedFunc } from "lodash";

export interface Quote {
  chainId: number;
  price: string;
  guaranteedPrice: string;
  estimatedPriceImpact: string;
  to: string;
  data: string;
  value: string;
  gas: string;
  estimatedGas: string;
  gasPrice: string;
  protocolFee: string;
  minimumProtocolFee: string;
  buyTokenAddress: string;
  sellTokenAddress: string;
  buyAmount: string;
  sellAmount: string;
  sources: any[];
  orders: any[];
  allowanceTarget: string;
  decodedUniqueId: string;
  sellTokenToEthRate: string;
  buyTokenToEthRate: string;
  expectedSlippage: string | null;
}

export type onSuccessFn = (data: Quote) => void;

export interface ZeroExApiRequestParams {
  sellToken: string;
  buyToken: string;
  sellAmount?: string;
  buyAmount?: string;
}

export type DebouncedFetch = DebouncedFunc<
  (params: ZeroExApiRequestParams, network: string) => Promise<void>
>;

export function useFetchDebounceQuote(onSuccess?: onSuccessFn, onError?: (error: unknown) => void) {
  const fetchSellQuoteRef = useRef<DebouncedFetch>();

  useEffect(() => {
    fetchSellQuoteRef.current = debounce(async (params, network) => {
      const endpoint = ENDPOINTS[CHAIN_IDS[network]];
      try {
        const response = await fetch(
          `${endpoint}/swap/v1/quote?${qs.stringify(params)}`
        );
        const quote: Quote = await response.json();
        onSuccess && onSuccess(quote);
      } catch (error) {
        onError && onError(error);
        console.error(error);
      }
    }, 500);

    return () => {
      fetchSellQuoteRef.current?.cancel();
    };
  }, [onSuccess, onError]);

  return fetchSellQuoteRef;
}