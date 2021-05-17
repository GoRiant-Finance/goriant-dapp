import React from "react";
import { useWallet } from "../../contexts/wallet";
import { CurrentUserBadge } from "../CurrentUserBadge";
import { ConnectButton } from "../ConnectButton";

export const ConnectStatus = (props: { left?: JSX.Element; right?: JSX.Element }) => {
  const {  connected } = useWallet();

  const connectStatus = (
      <div>
        {connected?
        <CurrentUserBadge />:
        <ConnectButton />
        }
      </div>
  );

  return connectStatus;
};
