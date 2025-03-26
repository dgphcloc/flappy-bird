"use client";
import dynamic from "next/dynamic";
import "../styles/global.css";
const GameSSR = dynamic(() => import("@/app/Game/Game"), { ssr: false });
import { Title, Center, Button, Container } from "@mantine/core";

export default function HomePage() {
  return (
    <Container
      style={{
        // margin: "0",
        padding: "0",
        width: "100vw",
      }}
    >
      <Center style={{ height: "100vh" }}>
        <GameSSR />
      </Center>
    </Container>
  );
}
