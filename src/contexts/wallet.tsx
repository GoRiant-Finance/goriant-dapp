import type { PublicKey } from "@solana/web3.js";

import Wallet from "@project-serum/sol-wallet-adapter";
import { Transaction } from "@solana/web3.js";
import { Button, Modal } from "antd";
import EventEmitter from "eventemitter3";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { notify } from "./../utils/notifications";
import { useConnectionConfig } from "./connection";
import { useLocalStorageState } from "./../utils/utils";
import { LedgerWalletAdapter } from "../wallet-adapters/ledger";
import { SolongWalletAdapter } from "../wallet-adapters/solong";
import { PhantomWalletAdapter } from "../wallet-adapters/phantom";
import { borderRadius } from "polished";
import { Row, Col } from 'antd'

const ASSETS_URL =
  "https://raw.githubusercontent.com/solana-labs/oyster/main/assets/wallets/";
export const WALLET_PROVIDERS = [
  {
    name: "Sollet",
    url: "https://www.sollet.io",
    icon: `${ASSETS_URL}sollet.svg`,
  },
  {
    name: "Solong",
    url: "https://solongwallet.com",
    icon: `${ASSETS_URL}solong.png`,
    adapter: SolongWalletAdapter,
  },
  {
    name: "Solflare",
    url: "https://solflare.com/access-wallet",
    icon: `${ASSETS_URL}solflare.svg`,
  },
  {
    name: "MathWallet",
    url: "https://mathwallet.org",
    icon: `${ASSETS_URL}mathwallet.svg`,
  },
  {
    name: "Ledger",
    url: "https://www.ledger.com",
    icon: `${ASSETS_URL}ledger.svg`,
    adapter: LedgerWalletAdapter,
  },
  {
    name: "Phantom",
    url: "https://phantom.app/",
    icon: `https://raydium.io/_nuxt/img/phantom.d9e3c61.png`,
    adapter: PhantomWalletAdapter,
  },
];

export interface WalletAdapter extends EventEmitter {
  publicKey: PublicKey | null;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  connect: () => any;
  disconnect: () => any;
}

const WalletContext = React.createContext<{
  wallet: WalletAdapter | undefined;
  connected: boolean;
  isUserRiant : boolean;
  setUserRiant: (test : boolean) => void;
  select: () => void;
  provider: typeof WALLET_PROVIDERS[number] | undefined;
}>({
  wallet: undefined,
  connected: false,
  isUserRiant: false,
  setUserRiant() {},
  select() {},
  provider: undefined,
});

export function WalletProvider({ children = null as any }) {
  const { endpoint } = useConnectionConfig();

  const [autoConnect, setAutoConnect] = useState(false);
  const [providerUrl, setProviderUrl] = useLocalStorageState("walletProvider");

  const provider = useMemo(
    () => WALLET_PROVIDERS.find(({ url }) => url === providerUrl),
    [providerUrl]
  );

  const wallet = useMemo(
    function () {
      if (provider) {
        return new (provider.adapter || Wallet)(
          providerUrl,
          endpoint
        ) as WalletAdapter;
      }
    },
    [provider, providerUrl, endpoint]
  );

  console.log("Wallet: " + wallet);

  const [connected, setConnected] = useState(false);
  const [isUserRiant, setIsUserRiant] = useState(false);


  useEffect(() => {
    if (wallet) {
      wallet.on("connect", () => {
        if (wallet.publicKey) {
          setConnected(true);
          const walletPublicKey = wallet.publicKey.toBase58();
          const keyToDisplay =
            walletPublicKey.length > 20
              ? `${walletPublicKey.substring(
                  0,
                  7
                )}.....${walletPublicKey.substring(
                  walletPublicKey.length - 7,
                  walletPublicKey.length
                )}`
              : walletPublicKey;

          notify({
            message: "Wallet update",
            description: "Connected to wallet " + keyToDisplay,
          });
        }
      });

      wallet.on("disconnect", () => {
        setConnected(false);
        setIsUserRiant(false);
        notify({
          message: "Wallet update",
          description: "Disconnected from wallet",
        });
      });
    }

    return () => {
      setConnected(false);
      if (wallet) {
        wallet.disconnect();
      }
    };
  }, [wallet]);

  useEffect(() => {
    if (wallet && autoConnect) {
      wallet.connect();
      setAutoConnect(false);
    }

    return () => {};
  }, [wallet, autoConnect]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const select = useCallback(() => {console.log("test select") ;setIsModalVisible(true); console.log(isModalVisible)}, []);
  const close = useCallback(() => setIsModalVisible(false), []);
  const setUserRiant = (a : boolean) => setIsUserRiant(a);

  return (
    <WalletContext.Provider
      value={{

        wallet,
        connected,
        isUserRiant,
        setUserRiant,
        select,
        provider,
      }}
    >
      {children}
      <Modal
        title="Select Wallet"
        okText="Connect"
        visible={isModalVisible}
        okButtonProps={{ style: { display: "none" } }}
        onCancel={close}
        closable={false}
        width="100%"
      >
        <div>__________________</div>
        <Row justify="center" style={{maxWidth: "50%", margin: "auto"}}>
        {WALLET_PROVIDERS.map((provider) => {
          const onClick = function () {
            setProviderUrl(provider.url);
            setAutoConnect(true);
            close();
          };

          return (
            <Col className="border-modal" sm={5} xs={24}>
              <Button
                size="large"
                type={providerUrl === provider.url ? "link" : "ghost"}
                onClick={onClick}
                className="provider-button ant-button"
                icon={
                <img
                  alt={`${provider.name}`}
                  width={40}
                  height={40}
                  src={provider.icon}
                  className="provider-img"
                />
              }
                >
              {provider.name}
              </Button>
            </Col>
          );
        })}
        </Row>
      </Modal>
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const { wallet, connected, isUserRiant, setUserRiant, provider, select } = useContext(WalletContext);
  return {
    wallet,
    connected,
    provider,
    select,
    isUserRiant,
    publicKey: wallet?.publicKey,
    setUserRiant(a : boolean){
      setUserRiant(a);
    },
    connect() {
      console.log(select());
      wallet ? wallet.connect() : select();
    },
    disconnect() {
      wallet?.disconnect();
    },
  };
}
