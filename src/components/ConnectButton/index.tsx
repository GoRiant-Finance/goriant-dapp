import { Button } from "antd";
import { ButtonProps } from "antd/lib/button";
import React from "react";
import { useWallet } from "../../contexts/wallet";

export interface ConnectButtonProps
  extends ButtonProps,
    React.RefAttributes<HTMLElement> {
  allowWalletChange?: boolean;
}

export const ConnectButton = (props: ConnectButtonProps) => {
  // should use SOL ◎ ?

  const { connect, connected } = useWallet();
  const { onClick, children, disabled, allowWalletChange, ...rest } = props;

  return (
      <Button 
      {...rest}
      onClick={connected?onClick:connect} disabled={connected && disabled} style={{ backgroundColor: "#06C270", color: "white", display: "inline-block", 
      borderRadius: "2em", paddingTop: "10px", paddingBottom: "10px", paddingRight: "20px", 
      paddingLeft: "20px", cursor: "pointer", fontWeight: 500}}>
          ConnectWallet
      </Button>
  );
};
