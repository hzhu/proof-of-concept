import { useRef, useState, useEffect, useCallback, Fragment } from "react";
import { json } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useSubmit, useLoaderData } from "@remix-run/react";
import { Combobox } from "@headlessui/react";
import { Outlet } from "@remix-run/react";

import { getSession } from "~/session.server";
import { getTranslations } from "../translations.server";
import { DarkModeToggle, LanguageSelect } from "~/components";

import type { Language, PickTranslations } from "../translations.server";

interface ICoin {
  id: string;
  name: string;
  large: string;
  thumb: string;
  symbol: string;
  market_cap_rank: null | number;
}

const defaultCoin = {
  id: "",
  name: "",
  large: "",
  thumb: "",
  symbol: "",
  market_cap_rank: null,
};

type LoaderData = {
  lang: Language;
  translations: PickTranslations<
    "Search" | "Search for coins" | "Switch between light and dark mode"
  >;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const coin = formData.get("coin");

  return redirect(`search/${coin}`);
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  const lang = session.getLang();
  const translations = getTranslations(lang, [
    "Search",
    "Search for coins",
    "Switch between light and dark mode",
  ]);
  const data: LoaderData = { lang, translations };

  return json(data);
};

export default function Search() {
  const [query, setQuery] = useState("");
  const [coin, setSelectedCoin] = useState<ICoin>(defaultCoin);
  const debouncedQuery = useDebounce<string>(query);
  const coins = useCoinSearch(debouncedQuery);
  const submit = useSubmit();
  const formRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = useCallback(
    (coin: ICoin) => {
      setSelectedCoin(coin);
      if (inputRef.current) {
        inputRef.current.value = coin.id;
        submit(formRef.current);
      }
    },
    [submit]
  );

  const { lang, translations } = useLoaderData<LoaderData>();

  return (
    <>
      <header className="flex items-end justify-end flex-col p-3 sm:p-6">
        <DarkModeToggle
          label={translations["Switch between light and dark mode"]}
        />
        <LanguageSelect lang={lang} />
      </header>
      <Form
        ref={formRef}
        method="post"
        action={`/search/${coin.id}`}
        className="py-8 px-12 flex justify-center"
      >
        <div className="relative w-full max-w-xs">
          <Combobox value={coin} onChange={onChange}>
            <Combobox.Label className="text-slate-600 dark:text-slate-100">
              {translations["Search for coins"]}
            </Combobox.Label>
            <Combobox.Input
              ref={inputRef}
              name="coin"
              autoCorrect="off"
              autoComplete="off"
              autoCapitalize="off"
              placeholder={translations["Search"]}
              aria-haspopup="listbox"
              displayValue={(coin: ICoin) => coin.id}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-lg bg-white py-2 pl-3 pr-10 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm dark:text-slate-800"
            />
            {query && coins.length ? (
              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {coins.map((coin) => (
                  <Combobox.Option as={Fragment} key={coin.id} value={coin}>
                    {({ active }) => (
                      <li
                        className={`flex items-center relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 ${
                          active ? "bg-blue-300" : "bg-white"
                        }`}
                      >
                        <img
                          alt={coin.name}
                          src={coin.thumb}
                          className="bg-white"
                          style={{ width: "25px", height: "25px" }}
                        />
                        <div className="mx-2">{coin.id}</div>
                      </li>
                    )}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            ) : null}
          </Combobox>
        </div>
      </Form>
      <Outlet />
    </>
  );
}

const searchCoins = async (query: string): Promise<ICoin[]> => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/search?query=${query}`
  );
  const { coins } = (await response.json()) as { coins: ICoin[] };

  return coins.filter(
    (coin) => coin.thumb !== "missing_thumb.png" && coin.market_cap_rank
  );
};

function useCoinSearch(query: string) {
  const [coins, setCoins] = useState<ICoin[]>([]);

  useEffect(() => {
    if (query.trim() === "") {
      setCoins([]);
    } else {
      let isFresh = true;

      searchCoins(query).then((coins) => {
        if (isFresh) setCoins(coins);
      });
      return () => {
        isFresh = false;
      };
    }
  }, [query]);

  return coins;
}

function useDebounce<T>(value: T, wait: number = 1000) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, wait);

    return () => {
      clearTimeout(timerId);
    };
  }, [value, wait]);

  return debouncedValue;
}
