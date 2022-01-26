import { Body } from "./styles";
import useWeb3Modal from "./hooks/useWeb3Modal";
import { Header } from "./components/Header";
import { useEffect, useState } from "react";
// import { ethers } from "ethers";
import { Intro } from "./components/Intro";
import { Play } from "./components/Play";
import { Main } from "./components/Main";
import { Pages } from "./components/pages";
import { getLevelBonus, getLevelPrice, getUserCoinBalance, getUserLevel, upgrade } from "./functions/contract";
import { levelBonus } from "./functions/cloud";

function App() {
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const [page, changePage] = useState(Pages.intro);
  const [level, setLevel] = useState(0);
  const [balance, setBalance] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [nextPrice, setNextPrice] = useState(0);
  const [nextBonus, setNextBonus] = useState(0);

  useEffect(() => {
    async function start() {
      if (provider) {
        setLevel(await getUserLevel(provider));
        setBalance(await getUserCoinBalance(provider));
      } else {
        setLevel(0);
        setBalance(0);
      }
    }
    start();
  }, [provider]);

  useEffect(() => {
    async function start() {
      if (provider) {
        setBonus(await getLevelBonus(provider, level));
        setNextBonus(await getLevelBonus(provider, level + 1));
        setNextPrice(await getLevelPrice(provider, level + 1));
      } else {
        setBonus(0);
        setNextBonus(0);
        setNextPrice(0);
      }
    }
    start();
  }, [provider,level]);

  useEffect(() => {
    if (provider) {
      if (page === Pages.intro) changePage(Pages.main);//Todo change back
    } else if (page === Pages.main) changePage(Pages.intro);
  }, [provider, page]);

  const upgradeButton = async () => {
    const newBalance = await upgrade(provider!, level);
    if (newBalance !== -1) {
      setBalance(balance - nextPrice);
      setLevel(level + 1);
    }
  };
  const finish = async (points: number) => {
    const newBalance = await levelBonus(points, await provider!.getSigner().getAddress(), level);
    if (newBalance !== -1) {
      setBalance(balance + bonus * points); //Todo change get from event
    } else console.log("error");
  };

  return (
    <div>
      <Header provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} level={level} balance={balance} />
      <Body>
        {page === Pages.intro && <Intro changePage={changePage} />}
        {page === Pages.main && (
          <Main
            changePage={changePage}
            level={level}
            balance={balance}
            bonus={bonus}
            nextPrice={nextPrice}
            upgradeButton={upgradeButton}
            nextBonus={nextBonus}
          />
        )}
        {page === Pages.play && <Play changePage={changePage} finish={finish} isLoggedIn={!!provider}/>}
      </Body>
    </div>
  );
}

export default App;
