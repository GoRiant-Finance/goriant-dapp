import React from "react";
import { useWallet } from "../../contexts/wallet";
import { formatNumber, shortenAddress } from "../../utils/utils";
import { Identicon } from "../Identicon";
import { useNativeAccount } from "../../contexts/accounts";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export const CurrentUserBadge = (props: {}) => {
  const { wallet } = useWallet();

  if (!wallet?.publicKey) {
    return null;
  }

  return (
      <span>
        {shortenAddress(`${wallet.publicKey}`)}
      </span>
  );
};
