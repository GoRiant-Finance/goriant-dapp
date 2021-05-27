import React from "react";
import { useWallet } from "../../contexts/wallet";
import { CurrentUserBadge } from "../currentUserBadge";
import { ConnectButton } from "../connectButton";
import {useConnection} from "../../contexts/connection";

export const ConnectStatus = (props: { left?: JSX.Element; right?: JSX.Element }) => {
  const {  wallet, connected } = useWallet()
  const { connection } = useConnection()

  const ConnectStatus = (
      <div>
        {connected?
        <CurrentUserBadge wallet={wallet} connection={connection} />:
        <ConnectButton />
        }
      </div>
  );

  return ConnectStatus;
};
