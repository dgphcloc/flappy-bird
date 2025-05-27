"use client";

import { Card, Group, ThemeIcon, Text, Loader, rem } from "@mantine/core";
import { FaChartLine } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRealtime } from "../context/SubscriptionProvider";

export default function TotalGamesToday() {
  const [total, setTotal] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const payload = useRealtime();

  const fetchTotal = async () => {
    try {
      const res = await fetch("/api/statsGamesToday");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setTotal(json.total_games_today);
      setError(null);
    } catch {
      setError("Unable to load data");
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchTotal();
  }, []);

  useEffect(() => {
    if (payload) fetchTotal();
  }, [payload]);

  return (
    <Card shadow="md" padding="lg" radius="md" withBorder>
      <Group justify="space-between" align="center">
        <div>
          <Text size="md" fw={300} c="dimmed">
            Games played today
          </Text>
          {error ? (
            <Text size="xl" fw={700} c="red">
              {error}
            </Text>
          ) : total === null ? (
            <Loader size="sm" mt="xs" />
          ) : (
            <Text size="xl" fw={900}>
              {total.toLocaleString()} plays
            </Text>
          )}
        </div>
        <ThemeIcon variant="light" size={rem(48)} radius="xl" color="blue">
          <FaChartLine size={24} />
        </ThemeIcon>
      </Group>
    </Card>
  );
}
