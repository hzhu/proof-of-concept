import { useFetcher, useSearchParams } from "@remix-run/react";
import type { FC } from "react";

import type { Language } from "~/translations.server";

// TODO: support RTL
export const LanguageSelect: FC<{ lang: Language }> = ({ lang }) => {
  const fetcher = useFetcher();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <>
      <label htmlFor="language-select" hidden>
        {/* TODO: internationalize me */}
        Select a language<span role="presentation">:</span>
      </label>
      <select
        value={lang}
        id="language-select"
        className="mt-3 border text-sm transition-[background] dark:transition-[background] duration-500 dark:duration-500 bg-slate-50 dark:text-slate-50 dark:bg-slate-900"
        onChange={(e) => {
          setSearchParams({
            ...Object.fromEntries(searchParams),
            lang: e.target.value,
          });

          fetcher.submit(
            { lang: e.target.value },
            { action: "action/set-lang", method: "post" }
          );
        }}
      >
        <option value="en">🇺🇸 English</option>
        <option value="es">🇪🇸 Español</option>
        <option value="fr">🇫🇷 Français</option>
      </select>
    </>
  );
};
