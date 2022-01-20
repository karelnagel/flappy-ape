import { Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useCallback, useEffect, useMemo, useState } from "react";
import Web3Modal from "web3modal";


const INFURA_ID = process.env.REACT_APP_INFURA_ID;
const NETWORK = process.env.REACT_APP_NETWORK;

function useWeb3Modal(config: { autoLoad?: boolean; infuraId?: string; network?: string; } = {}): [provider: Web3Provider | undefined, loadWeb3Modal: () => Promise<void>, logoutOfWeb3Modal: () => Promise<void>] {
  const [provider, setProvider] = useState<Web3Provider | undefined>();
  const [autoLoaded, setAutoLoaded] = useState(false);
  const { autoLoad = true, infuraId = INFURA_ID, network = NETWORK } = config;

  const web3Modal = useMemo(() => {
    return new Web3Modal({
      network,
      cacheProvider: true,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId
          }
        }
      }
    });
  }, [infuraId, network]);

  // Open wallet selection modal.
  const loadWeb3Modal = useCallback(async () => {
    const newProvider = await web3Modal.connect();
    setProvider(new Web3Provider(newProvider));

  }, [web3Modal]);

  const logoutOfWeb3Modal = useCallback(
    async function () {
      web3Modal.clearCachedProvider();
      window.location.reload();
    },
    [web3Modal]
  );

  // If autoLoad is enabled and the the wallet had been loaded before, load it automatically now.
  useEffect(() => {
    if (autoLoad && !autoLoaded && web3Modal.cachedProvider) {
      loadWeb3Modal();
      setAutoLoaded(true);
    }
  }, [
    autoLoad,
    autoLoaded,
    loadWeb3Modal,
    setAutoLoaded,
    web3Modal.cachedProvider
  ]);
  return [provider, loadWeb3Modal, logoutOfWeb3Modal];
}

export default useWeb3Modal;
