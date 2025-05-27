"use client";

import { useEffect, useState } from "react";
import { LineChart } from "@mantine/charts";
import { Card, Text, Loader, Alert, Center } from "@mantine/core";
import { AiOutlineWarning } from "react-icons/ai";
import { useRealtime } from "@/context/SubscriptionProvider";

interface MatchData {
  hour: number;
  matches: number;
}

interface Props {
  userId: string;
}

export default function HourlyMatchChart({ userId }: Props) {
  const [data, setData] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const payload = useRealtime();
  const fetchData = async () => {
    try {
      const res = await fetch(`/api/users/${userId}/matchCountsByHour`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const json = await res.json();

      let arr = Array.isArray(json) ? json : json.data;
      if (typeof arr === "string") {
        arr = JSON.parse(arr);
      }
      setData(Array.isArray(arr) ? arr : []);
    } catch (e: unknown) {
      console.error("Fetch history error:", e);
      setError((e as Error).message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [userId]);

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
      <Alert color="red" icon={<AiOutlineWarning />} variant="light">
        {error}
      </Alert>
    );

  return (
    <Card withBorder shadow="sm" radius="md" p="lg" my="md">
      <Text fw={700} mb="sm">
        Hourly Matches
      </Text>
      <LineChart
        h={300}
        data={data.map((d) => ({ hour: `${d.hour}h`, matches: d.matches }))}
        dataKey="hour"
        series={[{ name: "matches", color: "blue.6" }]}
        curveType="linear"
      />
    </Card>
  );
}
