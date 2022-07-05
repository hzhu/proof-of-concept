import clsx from "clsx";
import qs from "qs";
import { json } from "@remix-run/node";
import { useAccount, useSendTransaction } from "wagmi";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { useCallback, useReducer } from "react";
import { parseUnits } from "@ethersproject/units";
import { ExchangeRate, CustomConnect, Spinner } from "~/components";
import { getInitialState, reducer } from "./reducer";
import { TOKENS } from "~/constants";
import { useFetchDebounceQuote } from "~/hooks/useFetchDebounceQuote";
import { useUrlWalletSync } from "~/hooks/useUrlWalletSync";
import { useNetworkStateSync } from "~/hooks/useNetworkStateSync";
import {
  onSellTokenSelect,
  onBuyTokenSelect,
  onDirectionChange,
} from "./handlers";
import { getSession } from "~/session.server";
import { getTranslations } from "../../translations.server";

import type { Language, PickTranslations } from "../../translations.server";
import type { LoaderFunction, LinksFunction } from "@remix-run/node";
import type { onSuccessFn } from "~/hooks/useFetchDebounceQuote";

import spinnerUrl from "~/styles/spinner.css";

type LoaderData = {
  lang: Language;
  translations: PickTranslations<
    | "Buy"
    | "Sell"
    | "Buy Amount"
    | "Sell Amount"
    | "Place Order"
    | "Connect Wallet"
    | "Fetching best price"
    | "Switch trading direction"
    | "disclosure"
  >;
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: spinnerUrl },
];

const selectStyles =
  "border rounded-md text-xl transition-[background] dark:transition-[background] duration-500 dark:duration-500 bg-slate-50 dark:text-slate-50 dark:bg-slate-900";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const session = await getSession(request);
  const lang = (url.searchParams.get("lang") as Language) || session.getLang();
  const translations = getTranslations(lang, [
    "Buy",
    "Sell",
    "Buy Amount",
    "Sell Amount",
    "Place Order",
    "Connect Wallet",
    "Fetching best price",
    "Switch trading direction",
    "disclosure",
  ]);
  const data: LoaderData = { lang, translations };

  return json(data);
};

export default function Swap() {
  const { isConnected } = useAccount();
  const { translations } = useLoaderData<LoaderData>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, dispatch] = useReducer(reducer, getInitialState(searchParams));
  console.log(state.network, '<-- state.network')

  useNetworkStateSync(dispatch);
  useUrlWalletSync();

  const onSellQuoteSuccess = useCallback<onSuccessFn>((data) => {
    dispatch({ type: "set sell quote", payload: data });
  }, []);

  const onBuyQuoteSuccess = useCallback<onSuccessFn>((data) => {
    dispatch({ type: "set buy quote", payload: data });
  }, []);

  const fetchSellQuoteRef = useFetchDebounceQuote(onSellQuoteSuccess);
  const fetchBuyQuoteRef = useFetchDebounceQuote(onBuyQuoteSuccess);

  const { sendTransaction } = useSendTransaction({
    request: {
      to: state.quote?.to,
      data: state.quote?.data,
      value: state.quote?.value,
      gasLimit: state.quote?.gas,
    },
  });

  return (
    <div className="p-3 mx-auto max-w-screen-sm ">
      <Link to="/">
        <h1 className="inline-block my-3 sm:text-5xl">🍵</h1>
      </Link>
      <hr />
      <form>
        <div className="mt-12 flex items-center">
          <label htmlFor="sell-select" hidden>
            {translations["Sell"]}
            <span role="presentation">:</span>
          </label>
          <img
            className="h-7 w-7 mr-2 rounded-md"
            alt={`${state.sellToken} logo`}
            src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${
              TOKENS[state.sellToken].address
            }/logo.png`}
          />
          <select
            name="sell"
            value={state.sellToken}
            id="sell-select"
            className={clsx(selectStyles, "mr-2", "w-1/3", "sm:w-2/5")}
            onChange={(e) => {
              onSellTokenSelect(e, state, dispatch);
              if (e.target.value === state.buyToken) {
                setSearchParams({
                  ...Object.fromEntries(searchParams),
                  sell: state.buyToken,
                  buy: state.sellToken,
                });
              } else {
                setSearchParams({
                  ...Object.fromEntries(searchParams),
                  sell: e.target.value,
                });
              }
            }}
          >
            {/* <option value="">--Choose a token--</option> */}
            <option value="usdc">USDC</option>
            <option value="dai">DAI</option>
            <option value="matic">MATIC</option>
            <option value="weth">WETH</option>
          </select>
          <label htmlFor="sell-amount" hidden>
            {translations["Sell Amount"]}
          </label>
          <input
            id="sell-amount"
            type="text"
            value={state.sellAmount || ""}
            pattern="^[0-9]*[.,]?[0-9]*$"
            inputMode="decimal"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            className={clsx(selectStyles, "w-2/3", "sm:w-3/5")}
            onChange={async (e) => {
              if (e.target.validity.valid) {
                dispatch({ type: "set sell amount", payload: e.target.value });
                dispatch({ type: "set direction", payload: "sell" });
                if (e.target.value) {
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
            }}
          />
        </div>
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            aria-label={translations["Switch trading direction"]}
            onClick={async () => {
              dispatch({ type: "reverse trade direction" });
              if (state.buyAmount || state.sellAmount) {
                onDirectionChange(state, dispatch);
              }
              setSearchParams({
                ...Object.fromEntries(searchParams),
                sell: state.buyToken,
                buy: state.sellToken,
              });
            }}
          >
            🔀
          </button>
        </div>

        <div className="mt-3 flex items-center">
          <label htmlFor="buy-select" hidden>
            {translations["Buy"]}
            <span role="presentation">:</span>
          </label>
          <img
            className="h-7 w-7 mr-2 rounded-md"
            alt={`${state.buyToken} logo`}
            src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${
              TOKENS[state.buyToken].address
            }/logo.png`}
          />
          <select
            name="buy"
            className={clsx(selectStyles, "mr-2", "w-1/3", "sm:w-2/5")}
            value={state.buyToken}
            id="buy-select"
            onChange={(e) => {
              onBuyTokenSelect(e, state, dispatch);
              if (e.target.value === state.sellToken) {
                setSearchParams({
                  ...Object.fromEntries(searchParams),
                  sell: state.buyToken,
                  buy: state.sellToken,
                });
              } else {
                setSearchParams({
                  ...Object.fromEntries(searchParams),
                  buy: e.target.value,
                });
              }
            }}
          >
            {/* <option value="">--Choose a token--</option> */}
            <option value="usdc">USDC</option>
            <option value="dai">DAI</option>
            <option value="matic">MATIC</option>
            <option value="weth">WETH</option>
          </select>
          <label htmlFor="buy-amount" hidden>
            {translations["Buy Amount"]}
          </label>
          <input
            id="buy-amount"
            type="text"
            value={state.buyAmount || ""}
            className={clsx(selectStyles, "w-2/3", "sm:w-3/5")}
            pattern="^[0-9]*[.,]?[0-9]*$"
            inputMode="decimal"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            onChange={(e) => {
              if (e.target.validity.valid) {
                dispatch({ type: "set buy amount", payload: e.target.value });
                dispatch({ type: "set direction", payload: "buy" });

                const params = {
                  sellToken: state.sellToken,
                  buyToken: state.buyToken,
                  buyAmount: parseUnits(
                    e.target.value,
                    TOKENS[state.buyToken].decimal
                  ).toString(),
                };

                if (e.target.value) {
                  if (fetchBuyQuoteRef.current) {
                    dispatch({ type: "fetching quote", payload: true });
                    fetchBuyQuoteRef.current(params, state.network);
                  }
                }
              }
            }}
          />
        </div>
        <div className="my-3 h-5 text-center sm:my-4">
          {state.fetching ? (
            <span className="flex items-center justify-center">
              <Spinner />
              <span className="mx-2 font-normal">
                {translations["Fetching best price"]}…
              </span>
            </span>
          ) : (
            <ExchangeRate
              quote={state.quote}
              sellToken={state.sellToken}
              buyToken={state.buyToken}
            />
          )}
        </div>
        {isConnected ? (
          <button
            type="button"
            disabled={state.fetching || state.quote === undefined}
            className="py-1 px-2 w-full text-slate-50 bg-blue-600 dark:bg-blue-500 active:bg-blue-600 disabled:text-slate-100 disabled:opacity-50"
            onClick={async () => {
              console.log({
                to: state.quote?.to,
                data: state.quote?.data,
                value: state.quote?.value,
              });
              if (window.confirm(translations["disclosure"])) {
                sendTransaction();
              }
            }}
          >
            {translations["Place Order"]}
          </button>
        ) : (
          <CustomConnect label={translations['Connect Wallet']} />
        )}
      </form>
    </div>
  );
}
