"use client";
import React, { useEffect, useState } from "react";
import { Card, Text, Loader, Center, Badge } from "@mantine/core";

interface HighestScoreProps {
  id: string;
}

export default function HighestScore({ id }: HighestScoreProps) {
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHighestScore() {
      setLoading(true);
      try {
        const res = await fetch(`/api/users/${id}/highestScore`);
        const json = await res.json();
        setScore(json.highestScore);
      } catch (err: unknown) {
        const message = (err as Error).message ?? "Unknown error";
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    fetchHighestScore();
  }, [id]);

  if (loading) {
    return (
      <Card>
        <Center style={{ height: 100 }}>
          <Loader />
        </Center>
      </Card>
    );
  }

  if (error) {
    return <Text c="red">Error: {error}</Text>;
  }

  return (
    <Card withBorder shadow="md" radius="md" p="lg" my="xl">
      <Text fw={500}>highest score</Text>
      <Badge color={score! > 0 ? "green" : "gray"} size="xl">
        {score ? score : "0"}
      </Badge>
    </Card>
  );
}
