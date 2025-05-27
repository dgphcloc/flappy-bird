"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Group,
  ThemeIcon,
  Text,
  Loader,
  Alert,
  Center,
} from "@mantine/core";
import { MdOutlineMilitaryTech } from "react-icons/md";
import { useRealtime } from "../context/SubscriptionProvider";

export default function HighestScoreToday() {
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const payload = useRealtime();

  const fetchScore = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/highestScoreToday");
      const json = await res.json();
      setScore(json.highestScore ?? 0);
      setError(null);
    } catch (err: unknown) {
      const message = (err as Error).message ?? "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScore();
  }, []);

  useEffect(() => {
    if (payload) {
      fetchScore();
    }
  }, [payload]);

  if (loading)
    return (
      <Card>
        <Center>
          <Loader my="lg" />
        </Center>
      </Card>
    );
  if (error) return <Alert color="red">{error}</Alert>;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between">
        <div>
          <Text size="md" fw={300} c="dimmed">
            Highest Score Today
          </Text>
          <Text size="xl" fw={900}>
            {score} points
          </Text>
        </div>
        <ThemeIcon variant="light" radius="xl" size="lg" color="yellow">
          <MdOutlineMilitaryTech size={24} />
        </ThemeIcon>
      </Group>
    </Card>
  );
}
