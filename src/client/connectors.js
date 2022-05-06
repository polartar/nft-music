import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import RPCURLS from "./private.json"

const RPC_URLS = {
  1: RPCURLS.RPC_URL_1,
  4: RPCURLS.RPC_URL_4,
};

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [1, 4],
});

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  qrcode: true,
});