"use client";
import React, { useEffect, useState } from "react";
import { Card, Text, Loader, Center } from "@mantine/core";
import { useRealtime } from "@/context/SubscriptionProvider";

interface TodayGameCountProps {
  id: string;
}

export default function TodayGameCount({ id }: TodayGameCountProps) {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const payload = useRealtime();
  async function fetchTodayCount() {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${id}/todayGames`);
      if (!res.ok) {
        throw new Error(`Status code ${res.status}`);
      }
      const json = await res.json();
      setCount(json.todayCount);
    } catch (err: unknown) {
      setError((err as Error).message ?? "Unkonwn error");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchTodayCount();
  }, [id]);

  useEffect(() => {
    if (payload) {
      fetchTodayCount();
    }
  }, [payload]);
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
    return <Text color="red">Lỗi: {error}</Text>;
  }

  return (
    <Card withBorder shadow="md" radius="md" p="lg" my="xl">
      <Text fw={500}>total game today</Text>
      <Text size="xl">{count}</Text>
    </Card>
  );
}
