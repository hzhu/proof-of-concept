import { useEffect } from "react";
import { useNetwork } from 'wagmi'
import type { Dispatch } from 'react'
import type { ActionTypes } from "../routes/swap/reducer";

export function useSyncNetwork (dispatch: Dispatch<ActionTypes>) {
  const { activeChain } = useNetwork();

  useEffect(() => {
    dispatch({
      type: "select network",
      payload: activeChain?.name.toLowerCase() || "ethereum",
    });
  }, [dispatch, activeChain]);
}
