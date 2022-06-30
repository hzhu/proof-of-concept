import clsx from "clsx";
import { json } from "@remix-run/node";
import { useSendTransaction } from "wagmi";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { useCallback, useReducer } from "react";
import { ExchangeRate, CustomConnect, Spinner } from "~/components";
import { getInitialState, reducer } from "./reducer";
import { TOKENS } from "~/constants";
import { useFetchDebounceQuote } from "~/hooks/useFetchDebounceQuote";
import {
  onSellTokenSelect,
  onBuyTokenSelect,
  onDirectionChange,
  onSellAmountChange,
  onBuyAmountChange,
} from "./handlers";
import { getSession } from "~/session.server";
import { getTranslations } from "../../translations.server";
import { WagmiConfig } from "wagmi";
import { useSetupWagmi } from "~/hooks/useSetupWagmi";
import {
  lightTheme,
  darkTheme,
  ConnectButton,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { DarkModeToggle, LanguageSelect } from "~/components";
import type { FC } from "react";
import type { Language, PickTranslations } from "../../translations.server";
import type { LoaderFunction, LinksFunction } from "@remix-run/node";
import type { onSuccessFn } from "~/hooks/useFetchDebounceQuote";
import spinnerUrl from "~/styles/spinner.css";
import { useTheme } from "~/utils/theme-provider";
import { useSyncNetwork } from "~/hooks/useSyncNetwork";

type SwapTranslations = PickTranslations<
  | "Buy"
  | "Sell"
  | "Buy Amount"
  | "Sell Amount"
  | "Place Order"
  | "soon, my fren"
  | "Connect Wallet"
  | "Fetching best price"
  | "Switch trading direction"
  | "Switch between light and dark mode"
>;

type LoaderData = {
  lang: Language;
  translations: SwapTranslations;
  ENV: { ALCHEMY_ID?: string };
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: spinnerUrl },
];

const selectStyles =
  "border border-slate-400 rounded-md text-xl transition-[background] dark:transition-[background] duration-500 dark:duration-500 bg-slate-50 dark:text-slate-50 dark:bg-slate-900";

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
    "soon, my fren",
    "Connect Wallet",
    "Fetching best price",
    "Switch trading direction",
    "Switch between light and dark mode",
  ]);

  const data: LoaderData = {
    lang,
    translations,
    ENV: { ALCHEMY_ID: process.env.ALCHEMY_ID },
  };

  return json(data);
};

function Swap({
  translations,
  lang,
}: {
  translations: SwapTranslations;
  lang: Language;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, dispatch] = useReducer(reducer, getInitialState(searchParams));
  
  const { sendTransaction } = useSendTransaction({
    request: {
      to: state.quote?.to,
      data: state.quote?.data,
      value: state.quote?.value,
      gasLimit: state.quote?.gas,
    },
  });
  
  const onSellQuoteSuccess = useCallback<onSuccessFn>((data) => {
    dispatch({ type: "set sell quote", payload: data });
  }, []);
  
  const onBuyQuoteSuccess = useCallback<onSuccessFn>((data) => {
    dispatch({ type: "set buy quote", payload: data });
  }, []);
  
  const fetchSellQuoteRef = useFetchDebounceQuote(onSellQuoteSuccess);
  const fetchBuyQuoteRef = useFetchDebounceQuote(onBuyQuoteSuccess);

  useSyncNetwork(dispatch)

  return (
    <>
      <header className="flex items-end justify-end flex-col p-3 sm:p-6">
        <ConnectButton label={translations["Connect Wallet"]} />
        <DarkModeToggle
          label={translations["Switch between light and dark mode"]}
        />
        <LanguageSelect lang={lang} />
      </header>
      <div className="p-3 mx-auto max-w-screen-sm ">
        <Link to="/">
          <h1 className="inline-block my-3 text-5xl">🍵</h1>
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
                setSearchParams({
                  ...Object.fromEntries(searchParams),
                  sell: e.target.value,
                });
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
              onChange={(e) =>
                onSellAmountChange(e, state, dispatch, fetchSellQuoteRef)
              }
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
                setSearchParams({
                  ...Object.fromEntries(searchParams),
                  buy: e.target.value,
                });
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
              onChange={(e) =>
                onBuyAmountChange(e, state, dispatch, fetchBuyQuoteRef)
              }
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

          <CustomConnect label={translations["Connect Wallet"]}>
            <button
              type="button"
              disabled={state.fetching || state.quote === undefined}
              className="py-1 px-2 w-full text-slate-50 bg-blue-600 dark:bg-blue-500 active:bg-blue-600 disabled:text-slate-100 disabled:opacity-50"
              onClick={async () => {
                alert(translations["soon, my fren"])
              }}
            >
              {translations["Place Order"]}
            </button>
          </CustomConnect>
        </form>
      </div>
    </>
  );
}

const WithRainbowKit: FC = () => {
  const [theme] = useTheme();
  const { lang, translations, ENV } = useLoaderData<LoaderData>();
  const { client, chains } = useSetupWagmi({
    appName: "Matcha",
    alchemyId: ENV.ALCHEMY_ID,
  });

  return client && chains.length ? (
    <WagmiConfig client={client}>
      <RainbowKitProvider
        coolMode
        chains={chains}
        theme={
          theme === "light"
            ? lightTheme({ accentColor: "#2564eb", borderRadius: "none" })
            : darkTheme({ accentColor: "#3b83f6", borderRadius: "none" })
        }
      >
        <Swap translations={translations} lang={lang} />
      </RainbowKitProvider>
    </WagmiConfig>
  ) : null;
};

export default WithRainbowKit;
