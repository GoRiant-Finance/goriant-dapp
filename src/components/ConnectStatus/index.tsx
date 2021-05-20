import React from "react";
import { useWallet } from "../../contexts/wallet";
import { CurrentUserBadge } from "../currentUserBadge";
import { ConnectButton } from "../connectButton";

export const ConnectStatus = (props: { left?: JSX.Element; right?: JSX.Element }) => {
  const {  connected } = useWallet();

  const ConnectStatus = (
      <div>
        {connected?
        <CurrentUserBadge />:
        <ConnectButton />
        }
      </div>
  );

  return ConnectStatus;
};
