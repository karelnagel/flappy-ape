import { useEffect, useState } from "react";
import { PageInput, Pages } from "./pages";
import bird from "./bird.png";

interface PlayPageInput extends PageInput {
  finish: (points: number) => Promise<void>;
  isLoggedIn: boolean;
}
export function Play({ changePage, finish, isLoggedIn }: PlayPageInput) {
  const canvasHeight = 600;
  const canvasWidth = 600;
  const birdHeight = 50;
  const birdWidth = 50;
  const clickBoost = 100;
  const gravity = 5;
  const wallWidth = 30;
  const wallGap = 200;
  const wallSpeed = 12;
  const birdPadding = 10;
  const [wallLeft, setWallLeft] = useState(canvasWidth - wallWidth);
  const [height, setHeight] = useState(canvasHeight / 2);
  const [pause, setPause] = useState(true);
  const [wallHeight, setWallHeight] = useState(Math.random() * (canvasHeight - wallGap));
  const [score, setScore] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!pause) {
        setHeight(height - gravity);
        setWallLeft(wallLeft - wallSpeed);
        if (wallLeft <= 0) resetWall();
        if (height <= 0 || height >= canvasHeight - birdHeight) dead();
        else if (wallLeft > birdPadding && wallLeft < birdPadding + birdWidth)
          if (height < wallHeight || height + birdHeight > wallHeight + wallGap) dead();
      }
    }, 20);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);
  useEffect(()=>{
    if (score>0&&pause &&isLoggedIn) finish(score)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[pause])

  const dead = () => {
    setPause(true);
  };
  const onClick = () => {
    if (pause) start();
    else setHeight(height + clickBoost);
  };

  const resetWall = () => {
    setWallHeight(Math.random() * (canvasHeight - wallGap));
    setWallLeft(canvasWidth - wallWidth);
    setScore(score + 1);
  };
  const start = () => {
    setHeight(canvasHeight / 2);
    setWallLeft(canvasWidth - wallWidth);
    setScore(0);
    setPause(false);
  };
  const Background = {
    backgroundColor: "blue",
    width: canvasWidth + "px",
    height: canvasHeight + "px",
    position: "relative",
  } as React.CSSProperties;

  const WallUp = {
    backgroundColor: "green",
    left: wallLeft + "px",
    top: "0",
    width: wallWidth + "px",
    height: canvasHeight - wallHeight - wallGap + "px",
    position: "absolute",
  } as React.CSSProperties;

  const WallDown = {
    backgroundColor: "green",
    left: wallLeft + "px",
    bottom: "0",
    width: wallWidth + "px",
    height: wallHeight + "px",
    position: "absolute",
  } as React.CSSProperties;

  const Image = {
    height: birdHeight + "px",
    width: birdWidth + "px",
    left: birdPadding + "px",
    bottom: height + "px",
    position: "absolute",
  } as React.CSSProperties;
  return (
    <div>
      <button onClick={() => changePage(Pages.main)}>Exit</button>
      <p>Score: {score}</p>
      <div style={Background} onClick={() => onClick()}>
        <img src={bird} style={Image} alt="" />
        <div style={WallUp}></div>
        <div style={WallDown}></div>
      </div>
    </div>
  );
}
