"use client";
import { useEffect, useRef } from "react";
import * as Phaser from "phaser";
import PreLoadScene from "./scenes/PreLoadScene";
import BackgroundScene from "./scenes/BackgroundScene";
import MenuLoginScene from "./scenes/MenuLoginScene";
import { Box } from "@mantine/core";
import LoginScene from "./scenes/LoginScene";
import RegisterScene from "./scenes/RegisterScene";
import GamePlayScene from "./scenes/GamePlayScene";
import TopPlayerScene from "./scenes/TopPlayerScene";
import SettingScene from "./scenes/SettingScene";
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
      scene: [
        PreLoadScene,
        BackgroundScene,
        MenuLoginScene,
        LoginScene,
        RegisterScene,
        GamePlayScene,
        TopPlayerScene,
        SettingScene,
      ],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      render: {
        pixelArt: false, // Đặt true nếu bạn làm pixel art
        antialias: true, // Làm mượt các cạnh
        roundPixels: false, // Làm tròn pixel
      },
      dom: {
        createContainer: true,
      },
      input: {
        mouse: {
          target: gameRef.current,
        },
        touch: {
          target: gameRef.current,
        },
      },
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);
  const sizeHeight = Math.max(
    window.visualViewport?.height || window.innerHeight
  );
  const sizeWidth = Math.max(window.visualViewport?.width || window.innerWidth);
  // console.log(sizeHeight, sizeWidth);
  return (
    <Box
      ref={gameRef}
      style={{ width: `${sizeWidth}px`, height: `${sizeHeight}px` }}
    />
  );
};

export default Game;
