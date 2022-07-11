import { formatUnits } from "@ethersproject/units";
import { TOKENS } from "~/constants";
import type { Quote } from "~/hooks/useFetchDebounceQuote";

type TradeDirection = "buy" | "sell";

export interface IReducerState {
  network: string;
  sellToken: string;
  buyToken: string;
  fetching: boolean;
  quote?: Quote;
  sellAmount?: string;
  buyAmount?: string;
  direction?: TradeDirection;
}

export type ActionTypes =
  | { type: "reset" }
  | { type: "reverse trade direction" }
  | { type: "set direction"; payload?: TradeDirection }
  | { type: "select network"; payload: string }
  | { type: "choose sell token"; payload: string }
  | { type: "choose buy token"; payload: string }
  | { type: "fetching quote"; payload: boolean }
  | { type: "set sell quote"; payload: Quote }
  | { type: "set buy quote"; payload: Quote }
  | { type: "set sell amount"; payload?: string }
  | { type: "set buy amount"; payload?: string };

const initialState = {
  sellToken: "usdc",
  buyToken: "weth",
  network: "ethereum",
  sellAmount: "",
  buyAmount: "",
  fetching: false,
};

const supportedTokens = new Set(["weth", "usdc", "dai", "matic"]);

export const getInitialState = (searchParams: URLSearchParams) => {
  const sell = searchParams.get("sell") || initialState.sellToken;
  const buy = searchParams.get("buy") || initialState.buyToken;

  return {
    ...initialState,
    sellToken: supportedTokens.has(sell) ? sell : initialState.sellToken,
    buyToken: supportedTokens.has(buy) ? buy : initialState.buyToken,
  };
};

// TODO (reducer composition): Probably want a single reducer to manage sell/buy
// token state then compose it with a larger reducer that handles general swap state
export const reducer = (
  state: IReducerState,
  action: ActionTypes
): IReducerState => {
  // console.log(action);
  switch (action.type) {
    case "select network":
      return { ...state, network: action.payload };
    case "choose sell token":
      if (state.buyToken === action.payload && state.sellToken === "") {
        return {
          ...state,
          sellToken: action.payload,
          buyToken: "",
        };
      }
      if (state.buyToken === action.payload) {
        return {
          ...state,
          sellToken: action.payload,
          buyToken: state.sellToken,
        };
      }
      return { ...state, sellToken: action.payload };
    case "choose buy token":
      if (state.sellToken === action.payload && state.buyToken === "") {
        return {
          ...state,
          sellToken: "",
          buyToken: action.payload,
        };
      }
      if (state.sellToken === action.payload) {
        return {
          ...state,
          sellToken: state.buyToken,
          buyToken: action.payload,
        };
      }
      return { ...state, buyToken: action.payload };
    case "set direction":
      return { ...state, direction: action.payload };
    case "reverse trade direction":
      if (state.direction === "sell") {
        return {
          ...state,
          buyToken: state.sellToken,
          sellToken: state.buyToken,
          sellAmount: "",
          buyAmount: state.sellAmount,
          direction: "buy",
        };
      } else if (state.direction === "buy") {
        return {
          ...state,
          buyToken: state.sellToken,
          sellToken: state.buyToken,
          buyAmount: "",
          sellAmount: state.buyAmount,
          direction: "sell",
        };
      } else {
        return {
          ...state,
          buyToken: state.sellToken,
          sellToken: state.buyToken,
        };
      }
    case "fetching quote":
      return { ...state, fetching: action.payload };
    case "set sell quote":
      return {
        ...state,
        fetching: false,
        quote: action.payload,
        buyAmount: Number(
          formatUnits(action.payload.buyAmount, TOKENS[state.buyToken].decimal)
        ).toString(),
      };
    case "set buy quote":
      return {
        ...state,
        fetching: false,
        quote: action.payload,
        sellAmount: Number(
          formatUnits(
            action.payload.sellAmount,
            TOKENS[state.sellToken].decimal
          )
        ).toString(),
      };
    case "set sell amount":
      return { ...state, sellAmount: action.payload };
    case "set buy amount":
      return { ...state, buyAmount: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
