import React from "react";
import { useWallet } from "../../contexts/wallet";
import { CurrentUserBadge } from "../currentUserBadge";
import { ConnectButton } from "../connectButton";
import {useConnection} from "../../contexts/connection";
import { Button, Popover } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { LABELS } from "../../constants";
import { Settings } from "../settings";

export const ConnectStatus = (props: { left?: JSX.Element; right?: JSX.Element }) => {
  const {  wallet, connected } = useWallet()
  const connection = useConnection()


  const ConnectStatus = (
      <div>
        {connected?
        <CurrentUserBadge wallet={wallet} connection={connection} />:
        <ConnectButton />
        }
        <Popover
        placement="topRight"
        title={LABELS.SETTINGS_TOOLTIP}
        content={<Settings />}
        trigger="click"
      >
        <Button
          shape="circle"
          size="large"
          type="text"
          icon={<SettingOutlined />}
        />
      </Popover>
      </div>
  );

  return ConnectStatus;
};
