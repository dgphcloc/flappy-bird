"use client";
import { useEffect, useRef } from "react";
import * as Phaser from "phaser";
import PreLoadScene from "./scenes/PreLoadScene";
import BackgroundScene from "./scenes/BackgroundScene";
const Game = () => {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: Math.min(window.innerWidth, 600),
      height: window.innerHeight,
      parent: gameRef.current,
      physics: {
        default: "arcade",
        arcade: { gravity: { x: 0, y: 300 } },
      },
      scene: [PreLoadScene, BackgroundScene],
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);
  const sizeHeight = window.innerHeight;
  const sizeWidth = Math.min(window.innerWidth, 600);
  return (
    <div
      ref={gameRef}
      style={{ width: `${sizeWidth}px`, height: `${sizeHeight}px` }}
    />
  );
};

export default Game;
