"use client";
import { useEffect, useRef } from "react";
import * as Phaser from "phaser";
import PreLoadScene from "./scenes/PreLoadScene";
import BackgroundScene from "./scenes/BackgroundScene";
import MenuLoginScene from "./scenes/MenuLoginScene";
const Game = () => {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: Math.min(window.innerWidth, (window.innerHeight * 9) / 16), // Giữ tỉ lệ 9:16
      height: Math.min(window.innerHeight, (window.innerWidth * 16) / 9),
      parent: gameRef.current,
      physics: {
        default: "arcade",
        arcade: { gravity: { x: 0, y: 0 } },
      },
      scene: [PreLoadScene, BackgroundScene, MenuLoginScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);
  const sizeHeight = Math.min(window.innerHeight);
  const sizeWidth = Math.min(window.innerWidth);
  return (
    <div
      ref={gameRef}
      style={{ width: `${sizeWidth}px`, height: `${sizeHeight}px` }}
    />
  );
};

export default Game;
