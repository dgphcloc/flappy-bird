"use client";

import { useEffect, useState } from "react";
import { BarChart } from "@mantine/charts";
import { Card, Text, Loader, Alert, Group, Center } from "@mantine/core";
import { AiOutlineWarning } from "react-icons/ai";
import { format } from "date-fns";
import { useRealtime } from "@/context/SubscriptionProvider";

interface Match {
  date: string;
  matches: number;
}

interface Props {
  id: string;
  month?: string; // Format: 'YYYY-MM'
}

export default function DailyMatchChart({ id, month }: Props) {
  const [data, setData] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const targetMonth = month ?? format(new Date(), "yyyy-MM");
  const payload = useRealtime();
  const fetchData = async () => {
    try {
      const res = await fetch(`/api/users/${id}/dailyMatches/${targetMonth}`);
      if (!res.ok) throw new Error("Failed to fetch data");
      const json = await res.json();
      setData(json.data);
    } catch (e: unknown) {
      const message = (e as Error).message ?? "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [id, month]);

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

  const totalMatches = data.reduce((sum, item) => sum + item.matches, 0);

  return (
    <Card withBorder radius="md" shadow="sm" p="lg" my="md">
      <Group justify="space-between" mb="xs">
        <Text fw={700}>Matches per Day in {targetMonth}</Text>
        <Text fw={700} c="blue">
          Total: {totalMatches}
        </Text>
      </Group>

      <BarChart
        h={300}
        data={data.map((d) => ({
          date: d.date.slice(8),
          matches: d.matches,
        }))}
        dataKey="date"
        series={[{ name: "matches", color: "blue.6" }]}
        xAxisLabel="Day"
      />
    </Card>
  );
}
