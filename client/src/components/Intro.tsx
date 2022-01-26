import { PageInput, Pages } from "./pages";

export function Intro({changePage}:PageInput ) {
  return (
    <div>
      <h1>Hello</h1>
      <h4>This is Flappy Ape game</h4>
      <h4>How to play rules</h4>
      <h4>Connect your wallet to start earning coins to buy bonuses</h4>
      <p>Connect your wallet</p>
      <p>or</p>
      <button onClick={() => changePage(Pages.play)}>Play without bonuses</button>
    </div>
  );
}
