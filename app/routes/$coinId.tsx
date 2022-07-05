import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ params }) => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${params.coinId}`
  );
  const data = await response.json();
  const { description = {}, ico_data, contract_address, image = {}, links = {}, name } = data;
  const { en } = description;
  const { large } = image;
  const { description: icoDescription = "" } = ico_data || {};
  const { twitter_screen_name } = links;

  return json({
    name,
    image: large,
    contract_address,
    twitter_screen_name,
    description: (en || icoDescription).split(".")[0] + ".",
  });
};

export default function Coin() {
  const coin = useLoaderData();

  return (
    <div className="py-3 px-6 md:py-12 md:px-32 max-w-screen-lg mx-auto">      
      <div className="flex items-center">
        <img alt="" src={coin.image} className="w-10" />
        <h1 className="mx-1 text-2xl md:text-3xl">{coin.name}</h1>
      </div>
      <hr className="my-2" />
      <a
        href={`https://twitter.com/${coin.twitter_screen_name}`}
        className="text-sky-800 text-lg hover:bg-sky-200"
      >
        <svg
          className="w-6 inline-block relative bottom-0.5"
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="rgb(29, 155, 240)"
        >
          <g>
            <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
          </g>
        </svg>
        @{coin.twitter_screen_name}
      </a>
      <p className="mt-1">{coin.description}</p>
      <Link to="/search" className="inline-block mt-3">&larr; Navigate to search page</Link>
    </div>
  );
}
