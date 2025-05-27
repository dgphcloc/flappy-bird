"use client";
import dynamic from "next/dynamic";
// import "../styles/global.css";
const GameSSR = dynamic(() => import("@/app/Game/Game"), { ssr: false });
import { Container, Box } from "@mantine/core";

export default function HomePage() {
  return (
    // <Center style={{ height: "100vh", margin: "0" }}>
    // </Center>

    <Container
      style={{
        // margin: "0",
        padding: "0",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <GameSSR />
      </Box>
    </Container>
  );
}
