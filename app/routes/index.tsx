import { Link } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSession } from "~/session.server";
import { getTranslations } from "../translations.server";

import type { LoaderFunction } from "@remix-run/node";
import type { PickTranslations } from "../translations.server";

type LoaderData = {
  translations: PickTranslations<"Hello" | "Home page" | "Start trading">;
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  const lang = session.getLang();
  const translations = getTranslations(lang, [
    "Home page",
    "Hello",
    "Start trading",
  ]);
  const data: LoaderData = { translations };

  return json(data);
};

export default function Index() {
  const { translations } = useLoaderData<LoaderData>();

  return (
    <div className="p-3">
      <h1 className="text-4xl">🍵 {translations["Home page"]}</h1>
      <p className="my-3">{translations["Hello"]}.</p>
      <Link
        to="/swap"
        className="py-1 px-2 mt-3 text-slate-50 bg-blue-600 dark:bg-blue-500 active:bg-blue-600 disabled:text-slate-500 disabled:bg-blue-300"
      >
        {translations["Start trading"]}
      </Link>
    </div>
  );
}
