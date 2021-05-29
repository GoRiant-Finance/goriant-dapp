import React from "react";
import { useWallet } from "../../contexts/wallet";
import { CurrentUserBadge } from "../currentUserBadge";
import { ConnectButton } from "../connectButton";
import { Button, Popover } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { LABELS } from "../../constants";
import { Settings } from "../settings";

export const ConnectStatus = (props: { left?: JSX.Element; right?: JSX.Element }) => {
  const {  connected } = useWallet();


  const ConnectStatus = (
      <div>
        {connected?
        <CurrentUserBadge />:
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
