import { PageInput, Pages } from "./pages";

interface MainPageInput extends PageInput {
  level: number;
  balance: number;
  nextPrice: number;
  bonus: number;
  nextBonus: number;
  upgradeButton: any;
}
export function Main({ level, balance, nextBonus: upgradeBonus, nextPrice: upgradePrice, upgradeButton, changePage, bonus }: MainPageInput) {
  return (
    <div>
      <p>Nice game!/Welcome back</p>
      <p>You have {balance} coins</p>
      <p>You are at level {level}</p>
      <p>Current bonus: {bonus}</p>
      <p>
        You can upgrade for {upgradePrice} coins and get {upgradeBonus}
      </p>
      <button onClick={upgradeButton}>Upgrade</button>
      <button onClick={() => changePage(Pages.play)}>Play again</button>
    </div>
  );
}
