import { json } from "@remix-run/node";
import { getSession } from "~/session.server";
import { fallbackLang } from "~/translations.server";
import type { ActionFunction } from "@remix-run/node";
import type { Language } from "~/translations.server";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request);
  const requestText = await request.text();
  const form = new URLSearchParams(requestText);
  const lang = form.get("lang") || fallbackLang;

  session.setLang(lang as Language);

  return json(
    { success: true },
    {
      headers: {
        "Set-Cookie": await session.commit(),
      },
    }
  );
};
