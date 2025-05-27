"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { format } from "date-fns";
import { LineChart } from "@mantine/charts";
import {
  Card,
  Select,
  Text,
  Loader,
  Alert,
  Group,
  Center,
} from "@mantine/core";
import { AiOutlineWarning } from "react-icons/ai";
import { useRealtime } from "@/context/SubscriptionProvider";

type DayMatch = {
  date: string; // ISO date e.g. "2025-04-01"
  matches: number;
};

type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

const months: { value: Month; label: string }[] = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export default function DailyMatchesStatistics() {
  const [data, setData] = useState<DayMatch[]>([]);
  const [month, setMonth] = useState<Month>(
    (new Date().getMonth() + 1) as Month
  );
  const [totalMatches, setTotalMatches] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const payload = useRealtime();
  const fetchDailyMatches = useCallback(async (m: Month) => {
    setLoading(true);
    setError(null);
    try {
      // format month as YYYY-MM
      const year = new Date().getFullYear();
      const monthStr = `${year}-${String(m).padStart(2, "0")}`;

      const res = await fetch(`/api/dailyMatchesAll/${monthStr}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);

      const json = await res.json();
      const arr: DayMatch[] = json.data;

      const total = arr.reduce((sum, d) => sum + d.matches, 0);

      const mapped = arr.map((d) => ({
        date: format(new Date(d.date), "MMM dd"),
        matches: d.matches,
      }));

      setData(mapped);
      setTotalMatches(total);
    } catch (e: unknown) {
      const message = (e as Error).message ?? "Unknown error";
      setError(message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDailyMatches(month);
  }, [month, fetchDailyMatches]);

  useEffect(() => {
    if (payload) {
      fetchDailyMatches(month);
    }
  }, [payload]);
  const chartSeries = useMemo(() => [{ name: "matches", color: "blue.6" }], []);

  return (
    <Card withBorder shadow="sm" radius="md" p="lg" my="md">
      <Group
        mb="lg"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text c="teal.6" fw={500} size="lg">
          Daily Matches Statistics
        </Text>

        <Text>Total: {totalMatches.toLocaleString()}</Text>
        <Select
          data={months.map((m) => ({
            value: String(m.value),
            label: m.label,
          }))}
          value={String(month)}
          onChange={(v) => v && setMonth(parseInt(v) as Month)}
          placeholder="Month"
          w={140}
        />
      </Group>

      {loading ? (
        <Center>
          <Loader my="xl" />
        </Center>
      ) : error ? (
        <Alert color="red" icon={<AiOutlineWarning />} variant="light">
          {error}
        </Alert>
      ) : (
        <LineChart
          h={300}
          data={data}
          dataKey="date"
          series={chartSeries}
          curveType="linear"
          connectNulls
        />
      )}
    </Card>
  );
}
