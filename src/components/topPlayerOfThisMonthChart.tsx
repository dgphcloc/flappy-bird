"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Text,
  Loader,
  Alert,
  ScrollArea,
  Group,
  Badge,
  Center,
} from "@mantine/core";
import { AiOutlineWarning } from "react-icons/ai";
import Link from "next/link";
import { useRealtime } from "../context/SubscriptionProvider";

interface Player {
  user_id: string;
  score: number;
  updated_at: string;
}

const rankColors = ["yellow.5", "gray.4", "orange.4"];
const rankLabels = ["🥇 1st", "🥈 2nd", "🥉 3rd"];

export default function TopPlayerOfThisMonthChart() {
  const [players, setPlayers] = useState<Player[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const payload = useRealtime();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/topPlayersThisMonth");
      const data = await res.json();

      if (res.ok) {
        setPlayers(data.topPlayers);
        setError(null);
      } else {
        throw new Error(data.error || "Failed to fetch players");
      }
    } catch (err: unknown) {
      const message = (err as Error).message ?? "Unknow error";
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
    <Card withBorder radius="md" shadow="lg" p="lg" my="md">
      <Text fw={700} size="lg" mb="md" color="blue.8">
        🌟 Top 3 Players of the Month
      </Text>

      <ScrollArea type="auto" pr="md">
        {players && players.length > 0 ? (
          players.map((player, index) => (
            <Card
              key={player.user_id}
              shadow="sm"
              p="md"
              my="sm"
              radius="md"
              style={{
                backgroundColor: rankColors[index] || "white",
                border: "1px solid #dee2e6",
              }}
            >
              <Group mb="xs">
                <Badge color="dark" size="sm" variant="filled">
                  {rankLabels[index] || `#${index + 1}`}
                </Badge>
                <Text size="sm" color="dimmed">
                  {new Date(player.updated_at).toLocaleDateString()}
                </Text>
              </Group>
              <Link href={`/admin/users/${player.user_id}`}>
                <Text fw={600} style={{ cursor: "pointer", color: "#1c7ed6" }}>
                  👤 User ID: {player.user_id}
                </Text>
              </Link>
              <Text mt={4}>🏆 Score: {player.score}</Text>
            </Card>
          ))
        ) : (
          <Text>No players found.</Text>
        )}
      </ScrollArea>
    </Card>
  );
}
