import {ButtonProps} from "antd/lib/button";
import React from "react";
import {useWallet} from "../../contexts/wallet";
import './../../core.less';

export interface ConnectButtonProps
  extends ButtonProps,
    React.RefAttributes<HTMLElement> {
  allowWalletChange?: boolean;
}

export const ConnectButton = (props: ConnectButtonProps) => {
  // should use SOL ◎ ?

  const { connect, select, connected } = useWallet();
  const { onClick, children, disabled, allowWalletChange, ...rest } = props;

  return (
      <div
      onClick={select} className="connect-button">
          Connect Wallet
      </div>
  );
};
