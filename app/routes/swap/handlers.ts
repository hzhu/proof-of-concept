import qs from "qs";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { TOKENS, ENDPOINTS, CHAIN_IDS } from "~/constants";
import { fetchQuote } from "./utils";

import type { IReducerState } from "./reducer";
import type { ChangeEvent, Dispatch } from "react";
import type { ActionTypes } from "./reducer";
import type { Quote } from "~/hooks/useFetchDebounceQuote";

export async function onSellTokenSelect(
  e: ChangeEvent<HTMLSelectElement>,
  state: IReducerState,
  dispatch: Dispatch<ActionTypes>
) {
  dispatch({ type: "choose sell token", payload: e.target.value });
  if (state.sellAmount === "") return;
  if (e.target.value === state.buyToken) {
    const params = {
      sellToken: e.target.value,
      buyToken: state.sellToken,
      buyAmount: parseUnits(
        state.sellAmount || "",
        TOKENS[state.sellToken].decimal
      ).toString(),
    };
    dispatch({ type: "fetching quote", payload: true });
    dispatch({ type: "set buy amount", payload: state.sellAmount });
    dispatch({ type: "set sell amount", payload: "" });
    dispatch({ type: "set direction", payload: "buy" });
    const quote = await fetchQuote(ENDPOINTS[CHAIN_IDS[state.network]], params);
    dispatch({ type: "set buy quote", payload: quote });
  } else {
    const params = {
      sellToken: e.target.value,
      buyToken: state.buyToken,
      sellAmount: parseUnits(
        state.sellAmount || "",
        TOKENS[e.target.value].decimal
      ).toString(),
    };
    dispatch({ type: "fetching quote", payload: true });
    const quote = await fetchQuote(ENDPOINTS[CHAIN_IDS[state.network]], params);
    dispatch({ type: "set sell quote", payload: quote });
  }
}

export async function onBuyTokenSelect(
  e: ChangeEvent<HTMLSelectElement>,
  state: IReducerState,
  dispatch: Dispatch<ActionTypes>
) {
  dispatch({ type: "choose buy token", payload: e.target.value });
  if (state.buyAmount === "") return;
  if (e.target.value === state.sellToken) {
    const params = {
      buyToken: e.target.value,
      sellToken: state.buyToken,
      sellAmount: parseUnits(
        state.buyAmount || "",
        TOKENS[state.buyToken].decimal
      ).toString(),
    };
    dispatch({ type: "fetching quote", payload: true });
    dispatch({ type: "set sell amount", payload: state.buyAmount });
    dispatch({ type: "set buy amount", payload: "" });
    dispatch({ type: "set direction", payload: "sell" });
    const quote = await fetchQuote(ENDPOINTS[CHAIN_IDS[state.network]], params);
    dispatch({ type: "set sell quote", payload: quote });
  } else {
    const params = {
      sellToken: state.sellToken,
      buyToken: e.target.value,
      buyAmount: parseUnits(
        state.buyAmount || "0",
        TOKENS[e.target.value].decimal
      ).toString(),
    };
    dispatch({ type: "fetching quote", payload: true });
    const quote = await fetchQuote(ENDPOINTS[CHAIN_IDS[state.network]], params);
    dispatch({ type: "set buy quote", payload: quote });
  }
}

export async function onDirectionChange(
  state: IReducerState,
  dispatch: Dispatch<ActionTypes>
) {
  if (state.direction === "sell") {
    const params = {
      sellToken: state.buyToken,
      buyToken: state.sellToken,
      buyAmount: parseUnits(
        state.sellAmount || "0",
        TOKENS[state.sellToken].decimal
      ).toString(),
    };

    const endpoint = ENDPOINTS[CHAIN_IDS[state.network]];
    dispatch({ type: "fetching quote", payload: true });
    const response = await fetch(
      `${endpoint}/swap/v1/quote?${qs.stringify(params)}`
    );
    const data: Quote = await response.json();
    dispatch({ type: "set sell quote", payload: data });
    dispatch({
      type: "set sell amount",
      payload: Number(
        formatUnits(data.sellAmount, TOKENS[state.buyToken].decimal)
      ).toFixed(6),
    });
  } else {
    const params = {
      sellToken: state.buyToken,
      buyToken: state.sellToken,
      sellAmount: parseUnits(
        state.buyAmount || "0",
        TOKENS[state.buyToken].decimal
      ).toString(),
    };

    const endpoint = ENDPOINTS[CHAIN_IDS[state.network]];
    dispatch({ type: "fetching quote", payload: true });
    const response = await fetch(
      `${endpoint}/swap/v1/quote?${qs.stringify(params)}`
    );
    const data: Quote = await response.json();
    dispatch({ type: "set buy quote", payload: data });
    dispatch({
      type: "set buy amount",
      payload: Number(
        formatUnits(data.buyAmount, TOKENS[state.sellToken].decimal)
      ).toFixed(6),
    });
  }
}

export function onSellAmountChange(
  e: ChangeEvent<HTMLInputElement>,
  state: IReducerState,
  dispatch: Dispatch<ActionTypes>,
  fetchSellQuoteRef: any
) {
  if (e.target.validity.valid) {
    dispatch({ type: "set sell amount", payload: e.target.value });
    dispatch({ type: "set direction", payload: "sell" });
    if (
      e.target.value &&
      e.target.value !== "0" &&
      e.target.value.slice(-1) !== "."
    ) {
      console.log(e.target.value);
      const params = {
        sellToken: state.sellToken,
        buyToken: state.buyToken,
        sellAmount: parseUnits(
          e.target.value,
          TOKENS[state.sellToken].decimal
        ).toString(),
      };

      if (fetchSellQuoteRef.current) {
        dispatch({ type: "fetching quote", payload: true });
        fetchSellQuoteRef.current(params, state.network);
      }
    }
  }
}

export function onBuyAmountChange(
  e: ChangeEvent<HTMLInputElement>,
  state: IReducerState,
  dispatch: Dispatch<ActionTypes>,
  fetchBuyQuoteRef: any
) {
  if (e.target.validity.valid) {
    dispatch({ type: "set buy amount", payload: e.target.value });
    dispatch({ type: "set direction", payload: "buy" });

    if (
      e.target.value &&
      e.target.value !== "0" &&
      e.target.value.slice(-1) !== "."
    ) {
      const params = {
        sellToken: state.sellToken,
        buyToken: state.buyToken,
        buyAmount: parseUnits(
          e.target.value,
          TOKENS[state.buyToken].decimal
        ).toString(),
      };

      if (fetchBuyQuoteRef.current) {
        dispatch({ type: "fetching quote", payload: true });
        fetchBuyQuoteRef.current(params, state.network);
      }
    }
  }
}
