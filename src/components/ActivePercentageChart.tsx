"use client";

import { useEffect, useState } from "react";
import { DonutChart } from "@mantine/charts";
import {
  Card,
  Text,
  Loader,
  Alert,
  Group,
  ThemeIcon,
  Center,
} from "@mantine/core";
import { AiOutlineWarning } from "react-icons/ai";

export default function ActivePercentageChart() {
  const [percentage, setPercentage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/activePercentage");
        const json = await res.json();
        setPercentage(json.data.active);
      } catch (err: unknown) {
        const message = (err as Error).message ?? "Unknown error";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const inactive = 100 - (percentage ?? 0);

  return (
    <Card withBorder radius="md" shadow="sm" p="lg" my="md">
      <Text fw={700} mb="sm">
        Active User Rate (last 7 days)
      </Text>
      <Center>
        <DonutChart
          data={[
            { name: "Active", value: percentage ?? 0, color: "indigo.6" },
            { name: "Inactive", value: inactive, color: "yellow.6" },
          ]}
          size={300}
          thickness={40}
          chartLabel="Percentage of Active Users"
        />
      </Center>
      <Group mt="md" gap="lg" justify="space-between" style={{ width: "100%" }}>
        <Group>
          <ThemeIcon color="indigo" variant="filled" size="sm" radius="xl" />
          <Text size="sm">Active Users</Text>
        </Group>
        <Group>
          <ThemeIcon color="yellow" variant="filled" size="sm" radius="xl" />
          <Text size="sm">Inactive Users</Text>
        </Group>
      </Group>
    </Card>
  );
}
