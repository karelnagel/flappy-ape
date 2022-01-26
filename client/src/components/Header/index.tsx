import { Web3Provider } from "@ethersproject/providers";
import { HeaderStyle } from "../../styles";
import { WalletButton } from "./WalletButton";
interface HeaderInput {
  provider: Web3Provider | undefined;
  loadWeb3Modal: () => Promise<void>;
  logoutOfWeb3Modal: () => Promise<void>;
  balance: number;
  level: number;
}

export function Header(input: HeaderInput) {
  return (
    <HeaderStyle>
      {" "}
      <p>Coins: {input.balance}</p>
      <p>Level: {input.level}</p>
      <WalletButton provider={input.provider} loadWeb3Modal={input.loadWeb3Modal} logoutOfWeb3Modal={input.logoutOfWeb3Modal} />
    </HeaderStyle>
  );
}
