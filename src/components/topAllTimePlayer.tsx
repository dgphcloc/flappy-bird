"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Text,
  Loader,
  Alert,
  Group,
  Badge,
  Center,
  Stack,
} from "@mantine/core";
import { AiOutlineWarning } from "react-icons/ai";
import Link from "next/link";
import { useRealtime } from "../context/SubscriptionProvider";

interface Player {
  user_id: string;
  score: number;
  updated_at: string;
}

const rankColors = [
  "linear-gradient(145deg, #f6e05e, #fbd38d)",
  "linear-gradient(145deg, #e2e8f0, #cbd5e0)",
  "linear-gradient(145deg, #f6ad55, #ed8936)",
];
const rankLabels = ["🥇 All-time No.1", "🥈 All-time No.2", "🥉 All-time No.3"];

export default function TopAllTimePlayers() {
  const [players, setPlayers] = useState<Player[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const payload = useRealtime();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/topPlayersAllTime");
      const { data } = await res.json();
      console.log("data", data);
      if (res.ok) {
        setPlayers(data);
        setError(null);
      } else {
        throw new Error(data.error || "Failed to fetch players");
      }
    } catch (err: unknown) {
      const message = (err as Error).message ?? "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (payload) {
      fetchData();
    }
  }, [payload]);

  if (loading)
    return (
      <Card mt={20}>
        <Center>
          <Loader my="md" />
        </Center>
      </Card>
    );

  if (error)
    return (
      <Alert color="red" icon={<AiOutlineWarning />}>
        {error}
      </Alert>
    );

  return (
    <Card
      withBorder
      radius="md"
      shadow="xl"
      p="lg"
      my="md"
      style={{
        border: "2px solid #ffd700",
        background: "#fffbea",
      }}
    >
      <Text fw={800} size="xl" mb="lg" c="orange.9">
        🏆 Hall of Fame: Top 3 All-Time Scorers
      </Text>

      <Stack gap="md">
        {players?.map((player, index) => (
          <Card
            key={player.user_id}
            p="md"
            radius="lg"
            shadow="md"
            style={{
              background: rankColors[index],
              border: "2px solid #aaa",
            }}
          >
            <Group mb="xs">
              <Badge color="dark" size="lg" variant="filled">
                {rankLabels[index]}
              </Badge>
              <Text size="sm" color="dimmed">
                Updated: {new Date(player.updated_at).toLocaleDateString()}
              </Text>
            </Group>

            <Link href={`/admin/users/${player.user_id}`}>
              <Text
                fw={700}
                size="lg"
                style={{ cursor: "pointer", color: "#1c7ed6" }}
              >
                👤 User ID: {player.user_id}
              </Text>
            </Link>
            <Text size="md" mt={6}>
              🌟 Score: <strong>{player.score}</strong>
            </Text>
          </Card>
        ))}
      </Stack>
    </Card>
  );
}
