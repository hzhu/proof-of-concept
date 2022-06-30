import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { FC } from "react";

export const CustomConnect: FC<{ label?: string }> = ({
  children,
  label = "Connect Wallet",
}) => (
  <ConnectButton.Custom>
    {({ chain, account, mounted, openConnectModal }) => {
      return (
        <div
          {...(!mounted && {
            "aria-hidden": true,
            style: {
              opacity: 0,
              pointerEvents: "none",
              userSelect: "none",
            },
          })}
        >
          {(() => {
            if (!mounted || !account || !chain) {
              return (
                <button
                  onClick={openConnectModal}
                  type="button"
                  className="py-1 px-2 w-full text-slate-50 bg-blue-600 dark:bg-blue-500 active:bg-blue-600"
                >
                  {label}
                </button>
              );
            }

            return children;
          })()}
        </div>
      );
    }}
  </ConnectButton.Custom>
);
