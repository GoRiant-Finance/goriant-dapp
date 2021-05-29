import React from "react";
import { useWallet } from "../../contexts/wallet";
import { shortenAddress } from "../../utils/utils";
import './../../core.less'

export const CurrentUserBadge = (props: {}) => {
  const { wallet } = useWallet();

  if (!wallet?.publicKey) {
    return null;
  }

  return (
      <span style={{fontSize: 19}}>
        {shortenAddress(`${wallet.publicKey}`)}
      </span>
  );
};
