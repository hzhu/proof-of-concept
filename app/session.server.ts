import { createCookieSessionStorage } from "@remix-run/node";
import { fallbackLang } from "~/translations.server";
import { isTheme } from "./utils/theme-provider";
import type { Language } from "~/translations.server";
import type { Theme } from "./utils/theme-provider";

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "session",
    secure: true,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
});

async function getSession(request: Request) {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));

  return {
    getLang: () => {
      const langValue: Language = session.get("lang") || fallbackLang;
      return langValue;
    },
    setLang: (lang: Language) => session.set("lang", lang),
    getTheme: () => {
      const themeValue = session.get("theme");
      return isTheme(themeValue) ? themeValue : null;
    },
    setTheme: (theme: Theme) => session.set("theme", theme),
    commit: () => sessionStorage.commitSession(session),
  };
}

export { getSession };
