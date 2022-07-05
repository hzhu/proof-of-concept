import {
  Meta,
  Links,
  Outlet,
  Scripts,
  LiveReload,
  useLoaderData,
  ScrollRestoration,
} from "@remix-run/react";
import clsx from "clsx";
import { json } from "@remix-run/node";
import { WagmiConfig } from "wagmi";
import {
  lightTheme,
  darkTheme,
  ConnectButton,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { DarkModeToggle, LanguageSelect } from "~/components";
import { useSetupWagmi } from "~/hooks/useSetupWagmi";
import {
  useTheme,
  ThemeProvider,
  NonFlashOfWrongThemeEls,
} from "~/utils/theme-provider";
import { getSession } from "~/session.server";
import { getTranslations } from "./translations.server";

import type {
  MetaFunction,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/node";
import type { Theme } from "~/utils/theme-provider";
import type { Language, PickTranslations } from "./translations.server";

import tailwindUrl from "./tailwind.css";
import rainbowStylesUrl from "@rainbow-me/rainbowkit/styles.css";

type LoaderData = {
  theme: Theme | null;
  ENV: { ALCHEMY_ID?: string };
  translations: PickTranslations<
    "Connect Wallet" | "Switch between light and dark mode"
  >;
  lang: Language;
  pathname: string;
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: rainbowStylesUrl },
  { rel: "stylesheet", href: tailwindUrl },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Matcha",
  viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const session = await getSession(request);
  const lang = (url.searchParams.get("lang") as Language) || session.getLang();
  const translations = getTranslations(lang, [
    "Connect Wallet",
    "Switch between light and dark mode",
  ]);

  const data: LoaderData = {
    lang,
    translations,
    pathname: url.pathname,
    theme: session.getTheme(),
    ENV: { ALCHEMY_ID: process.env.ALCHEMY_ID },
  };

  return json(data);
};

function App() {
  const { lang, translations, ENV, pathname } = useLoaderData<LoaderData>();
  const { client, chains } = useSetupWagmi({
    appName: "Matcha",
    alchemyId: ENV.ALCHEMY_ID,
  });

  const [theme] = useTheme();
  const data = useLoaderData<LoaderData>();

  return (
    <html lang={lang} className={clsx(theme)}>
      <head>
        <Meta />
        <Links />
        <NonFlashOfWrongThemeEls ssrTheme={Boolean(data.theme)} />
      </head>
      <body className="bg-slate-50 text-gray-800 dark:text-gray-100 dark:bg-gray-900 transition duration-500">
        {client && chains.length ? (
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
              <header className="flex items-end justify-end flex-col p-3 sm:p-6">
                {pathname === "/swap" ? (
                  <ConnectButton label={translations["Connect Wallet"]} />
                ) : null}

                <DarkModeToggle
                  label={translations["Switch between light and dark mode"]}
                />
                <LanguageSelect lang={lang} />
              </header>
              <Outlet />
            </RainbowKitProvider>
          </WagmiConfig>
        ) : null}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  const data = useLoaderData<LoaderData>();

  return (
    <ThemeProvider specifiedTheme={data.theme}>
      <App />
    </ThemeProvider>
  );
}
