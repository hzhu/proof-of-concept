import qs from "qs";
import type { ZeroExApiRequestParams } from "~/hooks/useFetchDebounceQuote";

export async function fetchQuote(
  endpoint: string,
  params: ZeroExApiRequestParams
) {
  if (params.buyAmount && params.sellAmount) {
    throw Error(
      "The swap request params requires either a sellAmount or buyAmount. Do not provide both fields."
    );
  }

  if (!params.buyAmount && !params.sellAmount) {
    throw Error(
      "The swap request params requires either a sellAmount or buyAmount."
    );
  }

  if (params.buyToken === params.sellToken) {
    throw Error(
      `Cannot swap the same tokens: ${params.sellToken} & ${params.buyToken}.`
    );
  }

  const response = await fetch(
    `${endpoint}/swap/v1/quote?${qs.stringify(params)}`
  );
  const data = await response.json();

  return data;
}
