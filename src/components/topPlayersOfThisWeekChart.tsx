"use client";

import { useState, useEffect } from "react";
import { Card, Text, Loader, Alert, ScrollArea, Center } from "@mantine/core";
import { AiOutlineWarning } from "react-icons/ai";
import Link from "next/link";
import { useRealtime } from "../context/SubscriptionProvider";
import { endOfWeek, format, startOfWeek } from "date-fns";

interface Player {
  user_id: string;
  score: number;
  updated_at: string;
}

export default function TopPlayersChart() {
  const [players, setPlayers] = useState<Player[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const payload = useRealtime();
  const now = new Date();

  const weekStart = format(startOfWeek(now, { weekStartsOn: 1 }), "MM-dd");
  const weekEnd = format(endOfWeek(now, { weekStartsOn: 1 }), "MM-dd");

  const fetchData = async () => {
    setLoading(true);
    console.log("GOI API");
    try {
      const res = await fetch("/api/topPlayerOfWeek");
      const data = await res.json();
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
    <Card withBorder radius="md" shadow="sm" p="lg" my="md">
      <Text fw={700} mb="sm">
        Top 3 Players of the Week
      </Text>
      <Text>
        from: {weekStart} to:{weekEnd}
      </Text>
      <ScrollArea type="auto" pr="md">
        {players && players.length > 0 ? (
          players.map((player) => (
            <Card key={player.user_id} shadow="xs" p="md" my="sm">
              <Link href={`/admin/users/${player.user_id}`}>
                <Text style={{ cursor: "pointer", color: "blue" }}>
                  User ID: {player.user_id}
                </Text>
              </Link>
              <Text>Score: {player.score}</Text>
              <Text>
                Last Updated: {new Date(player.updated_at).toLocaleString()}
              </Text>
            </Card>
          ))
        ) : (
          <Text>No players found.</Text>
        )}
      </ScrollArea>
    </Card>
  );
}
